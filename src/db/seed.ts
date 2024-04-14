import { db } from "@/server/db"
import { faker } from "@faker-js/faker"
import { PrismaClient, type UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // const informationTechnologyFaculty = await prisma.faculty.upsert({
  //   where: { faculty: "INFOMATION_TECNOLOGY" },
  //   update: {},
  //   create: {
  //     name: "Information Tecnology",
  //     faculty: "INFOMATION_TECNOLOGY",
  //   },
  // })
  //
  // const businessAdministratorFaculty = await prisma.faculty.upsert({
  //   where: { faculty: "BUSINESS" },
  //   update: {},
  //   create: {
  //     name: "Business Administrator",
  //     faculty: "BUSINESS",
  //   },
  // })
  //
  // const graphicDesignFaculty = await prisma.faculty.upsert({
  //   where: { faculty: "GRAPHIC_DESIGN" },
  //   update: {},
  //   create: {
  //     name: "Graphic Design",
  //     faculty: "GRAPHIC_DESIGN",
  //   },
  // })
  //
  // console.log({
  //   informationTechnologyFaculty,
  //   businessAdministratorFaculty,
  //   graphicDesignFaculty,
  // })

  const role = ["STUDENT", "MARKETING_MANAGER", "GUEST"]

  const faculty = await db.faculty.findMany()

  await prisma.user.create({
    data: {
      name: faker.internet.userName(),
      email: "vutienphat0809@gmail.com",
      password: await bcrypt.hash("studentAccount@123", 10),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      phoneNumber: faker.string.numeric({ length: { min: 10, max: 11 } }),
      role: "STUDENT",
      facultyId:
        faculty[Math.floor(Math.random() * faculty.length)]?.id ?? null,
    },
  })

  await prisma.user.create({
    data: {
      name: faker.internet.userName(),
      email: "phatvu080903@gmail.com",
      password: await bcrypt.hash("mcAccount@123", 10),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      phoneNumber: faker.string.numeric({ length: { min: 10, max: 11 } }),
      role: "MARKETING_COORDINATOR",
      facultyId:
        faculty[Math.floor(Math.random() * faculty.length)]?.id ?? null,
    },
  })

  await prisma.user.create({
    data: {
      name: faker.internet.userName(),
      email: "phatvtgcs210973@fpt.edu.vn",
      password: await bcrypt.hash("adminAccount@123", 10),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      phoneNumber: faker.string.numeric({ length: { min: 10, max: 11 } }),
      role: "ADMIN",
      facultyId: null,
    },
  })

  await prisma.user.create({
    data: {
      name: faker.internet.userName(),
      email: "manager-account123@gmail.com",
      password: await bcrypt.hash("mmAccount@123", 10),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      phoneNumber: faker.string.numeric({ length: { min: 10, max: 11 } }),
      role: "MARKETING_MANAGER",
      facultyId: null,
    },
  })

  for (let i = 0; i < 10; i++) {
    const password = faker.internet.password({
      length: 10,
      pattern: /[A-Za-z0-9\d!@#$%^&*]/,
    })
    const hashPassword = await bcrypt.hash(password, 10)

    console.log(password)

    await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: hashPassword,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        phoneNumber: faker.string.numeric({ length: { min: 10, max: 11 } }),
        role: role[Math.floor(Math.random() * role.length)] as UserRole,
        facultyId:
          faculty[Math.floor(Math.random() * faculty.length)]?.id ?? null,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
