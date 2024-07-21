import type { ModuleMetadata } from "@scodi/common";
import { Command } from "commander";
import { expect, it } from "vitest";
import { createServerSubcommand } from "../../src/command/server/ServerCommand.js";

it("Create a server command", () => {
	const moduleMetadata: ModuleMetadata = {
		id: "test-server",
		type: "server",
		name: "Scodi Test Server",
		service: {
			name: "Test Server",
		},
	};

	const optionCors = '{"origin":"http://127.0..0.1:8080/"}';
	const optionPort = 3000;

	const program = new Command();

	const serverCommand = createServerSubcommand(moduleMetadata, () =>
		Promise.resolve(),
	);

	program.addCommand(serverCommand);
	program.parse(
		["test-server", "--port", optionPort.toString(), "--cors", optionCors],
		{ from: "user" },
	);

	expect(program.commands).toHaveLength(1);

	const command = program.commands[0];
	const options = command.opts();

	expect(command.name()).toBe(moduleMetadata.id);
	expect(Object.keys(options)).toHaveLength(3);
	expect(options).toHaveProperty("cors", JSON.parse(optionCors));
	expect(options).toHaveProperty("port", optionPort);
	expect(options).toHaveProperty("verbose", false);
});
