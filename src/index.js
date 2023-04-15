import {Address, Cell, fromNano} from "ton-core"
import * as types from "./types"
import {parseSupportedMessage} from "ton-experimental/dist/interfaces/parseSupportedMessage"

export const
  stake = ({messages: [inbound, ...outbounds]}) => (inbound?.body?.type === "deposit" && outbounds[0]?.body?.type === "deposit::ok") || ((inbound?.body?.type === "text" && inbound?.body?.data === "Deposit") && (outbounds[0]?.body?.type === "text" && outbounds[0]?.body?.data.match(/Stake \d+(\.\d+)? accepted/))),
  withdraw = ({messages: [inbound, ...outbounds]}) => (inbound?.body?.type === "withdraw" && outbounds[0]?.body?.type === "withdraw::ok") || ((inbound?.body?.type === "text" && inbound?.body?.data === "Withdraw") && (outbounds[0]?.body?.type === "text" && outbounds[0]?.body.data === "Withdraw completed")),
  fromHttpMsg = (msg) => {
    if (! msg) return null
    let message = {
      source: Address.from(msg.source),
      destination: Address.from(msg.destination),
      value: BigInt(msg.value),
      fee: BigInt(msg.fwd_fee),
      lt: BigInt(msg.created_lt),
      body: null
    }
    if (msg.msg_data?.["@type"] === "msg.dataText") message.body = {type: "text", data: Buffer.from(msg.msg_data.text, 'base64').toString('utf-8')}
    if (msg.msg_data?.["@type"] === "msg.dataRaw") {
      let body = parseSupportedMessage("com.tonwhales.nominators:v0", Cell.fromBoc(Buffer.from(msg.msg_data.body, "base64"))[0])
      message.body = body ? {...body} : {type: "payload", data: msg.msg_data.body}
    }
    return message
  },
  fromHttpTx = (tx) => {
    return {
      id: tx.transaction_id.hash,
      lt: BigInt(tx.transaction_id.lt),
      fee: {
        value: BigInt(tx.fee),
        other: BigInt(tx.other_fee),
        storage: BigInt(tx.storage_fee)
      },
      time: tx.utime,
      messages: [fromHttpMsg(tx.in_msg)].concat(tx.out_msgs.map(fromHttpMsg)),
      data: tx.data
    }
  }