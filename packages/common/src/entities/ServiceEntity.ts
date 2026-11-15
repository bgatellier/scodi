import { Entity, PrimaryKey } from "@mikro-orm/decorators/es";
import type { Service } from "../service/Service.js";

@Entity({ tableName: "service" })
export class ServiceEntity {
	@PrimaryKey()
	name!: Service["name"];

	constructor(service: Service) {
		this.name = service.name;
	}
}
