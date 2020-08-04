import { ObjectID } from "bson";
import { errorHandler } from "../utils";
import { Contact } from "../models";
import { generateFakeContacts } from "../utils";

export const getContacts = async (req, res) => {
  const contacts = await Contact.find()
    .populate("image")
    .exec();
  res.json({contacts})
};

export const getContact = async (req, res, next) => {
  const contactId = req.params.id;
  contactId || next(errorHandler("Please enter a contact ID", 400));
  contactId.length >= 24 || next(errorHandler("Invalid contact ID", 422));

  const contact = await Contact.findOne({
    _id: new ObjectID(contactId)
  })
    .populate("image")
    .exec();
  res.json(contact);
};

export const postContact = async (req, res, next) => {
  const contact = req.body;
  contact || next(errorHandler("Please submit valid contact", 400));
  contact.primaryContactNumber ||
    next(errorHandler("Please submit valid contact", 422));

  const newContact = new Contact({ ...contact });
  const { _id, _doc } = await newContact.save();

  _doc && _doc.primaryContactNumber
    ? res
        .status(201)
        .set("location", `/contacts/${_id}`)
        .json({ message: "Contact created", data: _doc })
    : next(errorHandler("No contact created"));
};

export const postManyContacts = async (req, res, next) => {
  const n = parseInt(req.query.n);
  n < 100 || next(errorHandler("Please enter number less than 100", 422));

  const generatedContacts = await Contact.insertMany(generateFakeContacts(n));

  res.status(201).json({
    message: `${n} contacts generated`,
    locations: generatedContacts.map(({ _id }) => `/api/v1/contacts/${_id}`)
  });
};

export const putContact = async (req, res, next) => {
  const contactId = req.params.id;
  const contactUpdate = req.body;

  contactId || next(errorHandler("Please enter a contact ID", 400));
  contactUpdate || next(errorHandler("Please submit valid contact", 400));

  const result = await Contact.updateOne(
    { _id: new ObjectID(contactId) },
    { $set: contactUpdate }
  );

  result.nModified === 1
    ? res.json({ message: "Contact updated" })
    : next(errorHandler("No data updated"));
};

export const deleteContact = async (req, res, next) => {
  const contactId = req.params.id;
  contactId || next(errorHandler("Please enter a contact ID", 422));

  const result = await Contact.deleteOne({
    _id: new ObjectID(contactId)
  });

  result.deletedCount === 1
    ? res.json({ message: "Contact deleted" })
    : next(errorHandler("No data deleted"));
};

export const deleteAllContact = async (req, res, next) => {
  const result = await Contact.deleteMany({});

  result.deletedCount > 0
    ? res.json({ message: "All contacts deleted" })
    : next(errorHandler("No data deleted"));
};
