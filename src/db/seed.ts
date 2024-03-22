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
