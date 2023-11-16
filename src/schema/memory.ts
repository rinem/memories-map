import {
  ObjectType,
  InputType,
  Field,
  ID,
  Float,
  Int,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { getBoundsOfDistance } from "geolib";
import { Context, AuthorizedContext } from "./context";

@InputType()
class CoordinatesInput {
  @Min(-90)
  @Max(90)
  @Field((_type) => Float)
  latitude!: number;

  @Min(-180)
  @Max(180)
  @Field((_type) => Float)
  longitude!: number;
}

@InputType()
class BoundsInput {
  @Field((_type) => CoordinatesInput)
  sw!: CoordinatesInput;

  @Field((_type) => CoordinatesInput)
  ne!: CoordinatesInput;
}

@InputType()
class MemoryInput {
  @Field((_type) => String)
  message!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field((_type) => Int)
  hearts!: number;
}

@ObjectType()
class Memory {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  userId!: string;

  @Field((_type) => Float)
  latitude!: number;

  @Field((_type) => Float)
  longitude!: number;

  @Field((_type) => String)
  message!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => String)
  publicId(): string {
    const parts = this.image.split("/");
    return parts[parts.length - 1];
  }

  @Field((_type) => Int)
  hearts!: number;

  @Field((_type) => [Memory])
  async nearby(@Ctx() ctx: Context) {
    const bounds = getBoundsOfDistance(
      { latitude: this.latitude, longitude: this.longitude },
      10000
    );

    return ctx.prisma.memory.findMany({
      where: {
        latitude: { gte: bounds[0].latitude, lte: bounds[1].latitude },
        longitude: { gte: bounds[0].longitude, lte: bounds[1].longitude },
        id: { not: { equals: this.id } },
      },
      take: 25,
    });
  }
}

@Resolver()
export class MemoryResolver {
  @Query((_returns) => Memory, { nullable: true })
  async memory(@Arg("id") id: string, @Ctx() ctx: Context) {
    return ctx.prisma.memory.findFirst({ where: { id: parseInt(id, 10) } });
  }

  @Query((_returns) => [Memory], { nullable: false })
  async memories(@Arg("bounds") bounds: BoundsInput, @Ctx() ctx: Context) {
    return ctx.prisma.memory.findMany({
      where: {
        latitude: { gte: bounds.sw.latitude, lte: bounds.ne.latitude },
        longitude: { gte: bounds.sw.longitude, lte: bounds.ne.longitude },
      },
      take: 50,
    });
  }

  @Authorized()
  @Mutation((_returns) => Memory, { nullable: true })
  async createMemory(
    @Arg("input") input: MemoryInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    return await ctx.prisma.memory.create({
      data: {
        userId: ctx.uid,
        image: input.image,
        message: input.message,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        hearts: input.hearts,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => Memory, { nullable: true })
  async updateMemory(
    @Arg("id") id: string,
    @Arg("input") input: MemoryInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    const memoryId = parseInt(id, 10);
    const memory = await ctx.prisma.memory.findOne({ where: { id: memoryId } });

    if (!memory || memory.userId !== ctx.uid) return null;

    return await ctx.prisma.memory.update({
      where: { id: memoryId },
      data: {
        image: input.image,
        message: input.message,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        hearts: input.hearts,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => Boolean, { nullable: false })
  async deleteMemory(
    @Arg("id") id: string,
    @Ctx() ctx: AuthorizedContext
  ): Promise<boolean> {
    const memoryId = parseInt(id, 10);
    const memory = await ctx.prisma.memory.findOne({ where: { id: memoryId } });

    if (!memory || memory.userId !== ctx.uid) return false;

    await ctx.prisma.memory.delete({
      where: { id: memoryId },
    });
    return true;
  }
}
