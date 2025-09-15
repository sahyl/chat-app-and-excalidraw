import { PrismaClient ,Prisma} from "@prisma/client";

const PrismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingletonType = ReturnType<typeof PrismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prismaClient: PrismaClientSingletonType | undefined;
};

const prismaClient= globalForPrisma.prismaClient?? PrismaClientSingleton();

export default prismaClient;
export{Prisma}

if (process.env.NODE_ENV === "production") {
  globalForPrisma.prismaClient= prismaClient;
}
