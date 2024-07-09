import sql from "./db.js";
import {faker} from "@faker-js/faker"

const seedUsers = async () => {
  const numberOfUsers = 10;

  // Generate and insert fake user data
  for (let i = 0; i < numberOfUsers; i++) {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const fullName = faker.person.fullName();
    const bio = faker.lorem.sentence();
    const avatar = faker.image.avatar();
    const coverImage = faker.image.imageUrl();
    const password = faker.internet.password();
    const dateOfBirth = faker.date.past(30).toISOString().split('T')[0]; // Random date of birth within the last 30 years

    // Construct the SQL query to insert a user
    await  sql`
      INSERT INTO users (username, email, fullName, bio, avatar, coverImage, password, dateOfBirth, createdAt, updatedAt)
      VALUES (${username}, ${email}, ${fullName}, ${bio}, ${avatar}, ${coverImage}, ${password}, ${dateOfBirth}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    console.log(`Inserted user ${i + 1}`);
  }

  console.log("Seeding complete!");
};
seedUsers();