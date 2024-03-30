import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client"

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

  const role = [
    "ADMIN",
    "STUDENT",
    "MARKETING_COORDINATOR",
    "MARKETING_MANAGER",
    "GUEST",
  ]
  const faculty = ["INFOMATION_TECNOLOGY", "BUSINESS", "GRAPHIC_DESIGN"]

  for (let i = 0; i < 1000; i++) {
    await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role[Math.floor(Math.random() * role.length)],
        faculty: faculty[Math.floor(Math.random() * faculty.length)],
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
