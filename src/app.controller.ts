import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      service: "gp-visits-system",
      status: "ok",
    };
  }

  @Get("health")
  health() {
    return {
      status: "ok",
    };
  }
}
