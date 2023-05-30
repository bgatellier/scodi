import type { Block, KnownBlock, WebAPICallResult } from "@slack/web-api"
import { WebClient } from "@slack/web-api"

/**
 * Simple Slack client:
 * Initialize a Slack client using:
 * - the SLACK_API_TOKEN process.env property
 * - the SLACK_CHANNEL_ID process.env property
 */
export class Client {
  #channel: string
  #client: WebClient

  constructor() {
    this.#channel = process.env.SLACK_CHANNEL_ID as string
    this.#client = new WebClient(process.env.SLACK_API_TOKEN)
  }

  public async postMessage(options: {
    blocks: (KnownBlock | Block)[]
    text: string
    icon_url?: string
    username?: string
  }): Promise<WebAPICallResult> {
    return this.#client.chat.postMessage({
      channel: this.#channel,
      ...options,
    })
  }
}
