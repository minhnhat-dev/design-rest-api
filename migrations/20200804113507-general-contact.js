const { company, name, address, phone, internet} = require('faker')

const generateFakeContacts = (n = 3) =>
    new Array(n).fill('toto').map(() => ({
      firstName: name.firstName(),
      lastName: name.lastName(),
      company: company.companyName(),
      jobTitle: name.jobTitle(),
      address: address.streetAddress(),
      city: address.city(),
      country: address.country(),
      primaryContactNumber: phone.phoneNumber(),
      otherContactNumbers: [phone.phoneNumber(), phone.phoneNumber()],
      primaryEmailAddress: internet.email(),
      otherEmailAddresses: [internet.email(), internet.email()],
      groups: ["Dev", "Node.js", "REST"],
      socialMedia: [
        { name: "Linkedin", link: internet.url() },
        { name: "Twitter", link: internet.url() }
      ]
    }));

module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    const contacts = generateFakeContacts(3)
    await db.collection('contact').insertMany(contacts);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    return
  }
};
