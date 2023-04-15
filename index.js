"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdraw = exports.stake = exports.fromHttpTx = exports.fromHttpMsg = void 0;
var _tonCore = require("ton-core");
var types = _interopRequireWildcard(require("./types"));
var _parseSupportedMessage = require("ton-experimental/dist/interfaces/parseSupportedMessage");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const stake = ({
    messages: [inbound, ...outbounds]
  }) => inbound?.body?.type === "deposit" && outbounds[0]?.body?.type === "deposit::ok" || inbound?.body?.type === "text" && inbound?.body?.data === "Deposit" && outbounds[0]?.body?.type === "text" && outbounds[0]?.body?.data.match(/Stake \d+(\.\d+)? accepted/),
  withdraw = ({
    messages: [inbound, ...outbounds]
  }) => inbound?.body?.type === "withdraw" && outbounds[0]?.body?.type === "withdraw::ok" || inbound?.body?.type === "text" && inbound?.body?.data === "Withdraw" && outbounds[0]?.body?.type === "text" && outbounds[0]?.body.data === "Withdraw completed",
  fromHttpMsg = msg => {
    if (!msg) return null;
    let message = {
      source: _tonCore.Address.from(msg.source),
      destination: _tonCore.Address.from(msg.destination),
      value: BigInt(msg.value),
      fee: BigInt(msg.fwd_fee),
      lt: BigInt(msg.created_lt),
      body: null
    };
    if (msg.msg_data?.["@type"] === "msg.dataText") message.body = {
      type: "text",
      data: Buffer.from(msg.msg_data.text, 'base64').toString('utf-8')
    };
    if (msg.msg_data?.["@type"] === "msg.dataRaw") {
      let body = (0, _parseSupportedMessage.parseSupportedMessage)("com.tonwhales.nominators:v0", _tonCore.Cell.fromBoc(Buffer.from(msg.msg_data.body, "base64"))[0]);
      message.body = body ? {
        ...body
      } : {
        type: "payload",
        data: msg.msg_data.body
      };
    }
    return message;
  },
  fromHttpTx = tx => {
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
    };
  };
exports.fromHttpTx = fromHttpTx;
exports.fromHttpMsg = fromHttpMsg;
exports.withdraw = withdraw;
exports.stake = stake;