"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transactions = exports.Transaction = exports.Pools = exports.Pool = exports.Message = exports.Members = exports.Member = exports.AddressFromString = void 0;
var types = _interopRequireWildcard(require("io-ts"));
var _tonCore = require("ton-core");
var _ioTsTypes = require("io-ts-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
_tonCore.Address.prototype.toShortString = function () {
  const address = this.toString();
  return address.substr(0, 8) + "…" + address.substr(-8);
};
_tonCore.Address.from = any => {
  try {
    return _tonCore.Address.parse(any);
  } catch (error) {
    return null;
  }
};
BigInt.prototype.format = function (fractionDigits = 8) {
  return Number((0, _tonCore.fromNano)(this)).toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }) + " TON";
};
const AddressFromString = new types.Type("AddressFromString", _tonCore.Address.isAddress, (value, context) => {
    try {
      return types.success(_tonCore.Address.parse(value));
    } catch (error) {
      return types.failure(value, context);
    }
  }, value => value.toRawString()),
  Message = types.type({
    source: types.union([types.null, AddressFromString]),
    destination: types.union([types.null, AddressFromString]),
    lt: _ioTsTypes.BigIntFromString,
    value: _ioTsTypes.BigIntFromString,
    fee: _ioTsTypes.BigIntFromString,
    body: types.union([types.null, types.type({
      type: types.literal("text"),
      data: types.string
    }), types.type({
      type: types.literal("payload"),
      data: types.string
    }), types.type({
      type: types.literal("deposit"),
      data: types.type({
        query_id: _ioTsTypes.BigIntFromString,
        gas_limit: _ioTsTypes.BigIntFromString
      })
    }), types.type({
      type: types.literal("deposit::ok")
    }), types.type({
      type: types.literal("withdraw"),
      data: types.type({
        stake: _ioTsTypes.BigIntFromString,
        query_id: _ioTsTypes.BigIntFromString,
        gas_limit: _ioTsTypes.BigIntFromString
      })
    }), types.type({
      type: types.literal("withdraw::delayed")
    }), types.type({
      type: types.literal("withdraw::ok")
    }), types.type({
      type: types.literal("upgrade"),
      data: types.type({
        code: types.unknown,
        query_id: _ioTsTypes.BigIntFromString,
        gas_limit: _ioTsTypes.BigIntFromString
      })
    }), types.type({
      type: types.literal("upgrade::ok")
    }), types.type({
      type: types.literal("update"),
      data: types.type({
        code: types.unknown,
        query_id: _ioTsTypes.BigIntFromString,
        gas_limit: _ioTsTypes.BigIntFromString
      })
    }), types.type({
      type: types.literal("update::ok")
    })])
  }),
  Transaction = types.type({
    id: types.string,
    lt: _ioTsTypes.BigIntFromString,
    time: types.number,
    fee: types.type({
      value: _ioTsTypes.BigIntFromString,
      storage: _ioTsTypes.BigIntFromString,
      other: _ioTsTypes.BigIntFromString
    }),
    messages: types.array(types.union([types.null, Message]))
  }),
  Transactions = types.array(Transaction),
  Pool = types.type({
    address: AddressFromString,
    name: types.string,
    params: types.type({
      enabled: types.boolean,
      updatesEnabled: types.boolean,
      minStake: _ioTsTypes.BigIntFromString,
      depositFee: _ioTsTypes.BigIntFromString,
      withdrawFee: _ioTsTypes.BigIntFromString,
      poolFee: _ioTsTypes.BigIntFromString,
      receiptPrice: _ioTsTypes.BigIntFromString
    }),
    status: types.type({
      proxyStakeAt: types.number,
      proxyStakeUntil: types.number,
      proxyStakeSent: _ioTsTypes.BigIntFromString,
      querySent: types.boolean,
      unlocked: types.boolean,
      ctxLocked: types.boolean
    }),
    balance: types.type({
      value: _ioTsTypes.BigIntFromString,
      sent: _ioTsTypes.BigIntFromString,
      pendingDeposits: _ioTsTypes.BigIntFromString,
      pendingWithdraw: _ioTsTypes.BigIntFromString,
      withdraw: _ioTsTypes.BigIntFromString
    })
    // created_at: date,
    // updated_at: date
  }),
  Pools = types.array(Pool),
  Member = types.type({
    address: AddressFromString,
    pool: AddressFromString,
    balance: _ioTsTypes.BigIntFromString,
    pendingDeposit: _ioTsTypes.BigIntFromString,
    pendingWithdraw: _ioTsTypes.BigIntFromString,
    withdraw: _ioTsTypes.BigIntFromString
    // created_at: date,
    // updated_at: date
  }),
  Members = types.array(Member);
exports.Members = Members;
exports.Member = Member;
exports.Pools = Pools;
exports.Pool = Pool;
exports.Transactions = Transactions;
exports.Transaction = Transaction;
exports.Message = Message;
exports.AddressFromString = AddressFromString;