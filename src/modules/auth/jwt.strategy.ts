import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { Role } from "@prisma/client";
import { AuthUser } from "../../common/auth-user.interface";

interface JwtPayload {
  sub: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? "dev-secret",
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid token.");
    }

    return {
      userId: user.id,
      role: user.role,
      doctorId: user.doctor?.id,
      patientId: user.patient?.id,
    };
  }
}
