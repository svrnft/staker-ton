import * as types from "io-ts"
import {Address, fromNano} from "ton-core"
import {BigIntFromString, date, DateFromISOString, DateFromNumber} from "io-ts-types"

Address.prototype.toShortString = function () {
  const address = this.toString()
  return address.substr(0, 8) + "…" + address.substr(-8)
}

Address.from = any => {
  try {
    return Address.parse(any)
  }
  catch (error) {
    return null
  }
}

BigInt.prototype.format = function (fractionDigits = 8) {
  return Number(fromNano(this)).toLocaleString("en-US", {minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits}) + " TON"
}

export const
  AddressFromString = new types.Type(
    "AddressFromString",
    Address.isAddress,
    (value, context) =>  {
      try {
        return types.success(Address.parse(value))
      }
      catch (error) {
        return types.failure(value, context)
      }
    },
    value => value.toRawString()
  ),
  Message = types.type({
    source: types.union([types.null, AddressFromString]),
    destination: types.union([types.null, AddressFromString]),
    lt: BigIntFromString,
    value: BigIntFromString,
    fee: BigIntFromString,
    body: types.union([
      types.null,
      types.type({
        type: types.literal("text"),
        data: types.string
      }),
      types.type({
        type: types.literal("payload"),
        data: types.string
      }),
      types.type({
        type: types.literal("deposit"),
        data: types.type({
          query_id: BigIntFromString,
          gas_limit: BigIntFromString
        })
      }),
      types.type({
        type: types.literal("deposit::ok"),
      }),
      types.type({
        type: types.literal("withdraw"),
        data: types.type({
          stake: BigIntFromString,
          query_id: BigIntFromString,
          gas_limit: BigIntFromString
        })
      }),
      types.type({
        type: types.literal("withdraw::delayed"),
      }),
      types.type({
        type: types.literal("withdraw::ok"),
      }),
      types.type({
        type: types.literal("upgrade"),
        data: types.type({
          code: types.unknown,
          query_id: BigIntFromString,
          gas_limit: BigIntFromString
        })
      }),
      types.type({
        type: types.literal("upgrade::ok"),
      }),
      types.type({
        type: types.literal("update"),
        data: types.type({
          code: types.unknown,
          query_id: BigIntFromString,
          gas_limit: BigIntFromString
        })
      }),
      types.type({
        type: types.literal("update::ok"),
      }),
    ])
  }),
  Transaction = types.type({
    id: types.string,
    lt: BigIntFromString,
    time: types.number,
    fee: types.type({
      value: BigIntFromString,
      storage: BigIntFromString,
      other: BigIntFromString
    }),
    messages: types.array(types.union([types.null, Message])),
  }),
  Transactions = types.array(Transaction),
  Pool = types.type({
    address: AddressFromString,
    name: types.string,
    params: types.type({
      enabled: types.boolean,
      updatesEnabled: types.boolean,
      minStake: BigIntFromString,
      depositFee: BigIntFromString,
      withdrawFee: BigIntFromString,
      poolFee: BigIntFromString,
      receiptPrice: BigIntFromString
    }),
    status: types.type({
      proxyStakeAt: types.number,
      proxyStakeUntil: types.number,
      proxyStakeSent: BigIntFromString,
      querySent: types.boolean,
      unlocked: types.boolean,
      ctxLocked: types.boolean
    }),
    balance: types.type({
      value: BigIntFromString,
      sent: BigIntFromString,
      pendingDeposits: BigIntFromString,
      pendingWithdraw: BigIntFromString,
      withdraw: BigIntFromString
    }),
    // created_at: date,
    // updated_at: date
  }),
  Pools = types.array(Pool),
  Member = types.type({
    address: AddressFromString,
    pool: AddressFromString,
    balance: BigIntFromString,
    pendingDeposit: BigIntFromString,
    pendingWithdraw: BigIntFromString,
    withdraw: BigIntFromString,
    // created_at: date,
    // updated_at: date
  }),
  Members = types.array(Member)
