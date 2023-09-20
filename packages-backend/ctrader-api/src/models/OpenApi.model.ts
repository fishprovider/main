/* eslint-disable max-len */
//
// order
//

export enum CTraderTradeSide {
  BUY = 1,
  SELL = 2,
}

export enum CTraderOrderType {
  MARKET = 1,
  LIMIT = 2,
  STOP = 3,
  STOP_LOSS_TAKE_PROFIT = 4,
  MARKET_RANGE = 5,
  STOP_LIMIT = 6,
}

export enum CTraderExecutionType {
  ORDER_ACCEPTED = 2, // Order passed validation.
  ORDER_FILLED = 3, // Order filled.
  ORDER_REPLACED = 4, // Pending order is changed with a new one.
  ORDER_CANCELLED = 5, // Order cancelled.
  ORDER_EXPIRED = 6, // Order with GTD time in force is expired.
  ORDER_REJECTED = 7, // Order is rejected due to validations.
  ORDER_CANCEL_REJECTED = 8, // Cancel order request is rejected.
  SWAP = 9, // Type related to SWAP execution events.
  DEPOSIT_WITHDRAW = 10, // Type related to event of deposit or withdrawal cash flow operation.
  ORDER_PARTIAL_FILL = 11, // Order is partially filled.
  BONUS_DEPOSIT_WITHDRAW = 12, // Type related to event of bonus deposit or bonus withdrawal.
}

export enum CTraderOrderStatus {
  ORDER_STATUS_ACCEPTED = 1, // Order request validated and accepted for execution.
  ORDER_STATUS_FILLED = 2, // Order is fully filled.
  ORDER_STATUS_REJECTED = 3, // Order is rejected due to validation.
  ORDER_STATUS_EXPIRED = 4, // Order expired. Might be valid for orders with partially filled volume that were expired on LP.
  ORDER_STATUS_CANCELLED = 5, // Order is cancelled. Might be valid for orders with partially filled volume that were cancelled by LP.
}

export enum CTraderPositionStatus {
  POSITION_STATUS_OPEN = 1,
  POSITION_STATUS_CLOSED = 2,
  POSITION_STATUS_CREATED = 3, // Empty position is created for pending order.
  POSITION_STATUS_ERROR = 4,
}

export enum CTraderDealStatus {
  FILLED = 2, // Deal filled.
  PARTIALLY_FILLED = 3, // Deal is partially filled.
  REJECTED = 4, // Deal is correct but was rejected by liquidity provider (e.g. no liquidity).
  INTERNALLY_REJECTED = 5, // Deal rejected by server (e.g. no price quotes).
  ERROR = 6, // Deal is rejected by LP due to error (e.g. symbol is unknown).
  MISSED = 7, // Liquidity provider did not sent response on the deal during specified execution time period.
}

export enum CTraderTimeInForce {
  GOOD_TILL_DATE = 1,
  GOOD_TILL_CANCEL = 2,
  IMMEDIATE_OR_CANCEL = 3,
  FILL_OR_KILL = 4,
  MARKET_ON_OPEN = 5,
}

//
// price
//

export enum CTraderQuoteType {
  BID = 1,
  ASK = 2,
}

export enum CTraderTrendbarPeriod {
  M1 = 1,
  M2 = 2,
  M3 = 3,
  M4 = 4,
  M5 = 5,
  M10 = 6,
  M15 = 7,
  M30 = 8,
  H1 = 9,
  H4 = 10,
  H12 = 11,
  D1 = 12,
  W1 = 13,
  MN1 = 14,
}

export enum CTraderDayOfWeek {
  NONE = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

export enum CTraderCommissionType {
  USD_PER_MILLION_USD = 1, // USD per million USD volume - usually used for FX. Example: 50 USD for 1 mil USD of trading volume.
  USD_PER_LOT = 2, // USD per 1 lot - usually used for CFDs and futures for commodities, and indices. Example: 15 USD for 1 contract.
  PERCENTAGE_OF_VALUE = 3, // Percentage of trading volume - usually used for Equities. Example: 0.005% of notional trading volume. Multiplied by 100,00.
  QUOTE_CCY_PER_LOT = 4, // Quote ccy of Symbol per 1 lot - will be used for CFDs and futures for commodities, and indices. Example: 15 EUR for 1 contract of DAX.
}

export enum CTraderMinCommissionType {
  CURRENCY = 1,
  QUOTE_CURRENCY = 2,
}

export enum CTraderSymbolDistanceType {
  SYMBOL_DISTANCE_IN_POINTS = 1,
  SYMBOL_DISTANCE_IN_PERCENTAGE = 2,
}

export enum CTraderTradingMode {
  ENABLED = 0,
  DISABLED_WITHOUT_PENDINGS_EXECUTION = 1,
  DISABLED_WITH_PENDINGS_EXECUTION = 2,
  CLOSE_ONLY_MODE = 3,
}

export enum CTraderSwapCalculationType {
  PIPS = 0, // Specifies type of SWAP computation as PIPS (0)
  PERCENTAGE = 1, // Specifies type of SWAP computation as PERCENTAGE (1, annual, in percent)
}

export enum CTraderOrderTriggerMethod {
  TRADE = 1, // Stop Order: buy is triggered by ask, sell by bid, Stop Loss Order: for buy position is triggered by bid and for sell position by ask.
  OPPOSITE = 2, // Stop Order: buy is triggered by bid, sell by ask, Stop Loss Order: for buy position is triggered by ask and for sell position by bid.
  DOUBLE_TRADE = 3, // The same as TRADE, but trigger is checked after the second consecutive tick.
  DOUBLE_OPPOSITE = 4, // The same as OPPOSITE, but trigger is checked after the second consecutive tick.
}

//
// account
//

export enum CTraderNotificationType {
  MARGIN_LEVEL_THRESHOLD_1 = 61, // one of three margin calls, they are all similar.
  MARGIN_LEVEL_THRESHOLD_2 = 62, // one of three margin calls, they are all similar.
  MARGIN_LEVEL_THRESHOLD_3 = 63, // one of three margin calls, they are all similar.
}

export enum CTraderAccessRights {
  FULL_ACCESS = 0, // Enable all trading.
  CLOSE_ONLY = 1, // Only closing trading request are enabled.
  NO_TRADING = 2, // View only access.
  NO_LOGIN = 3, // No access.
}

export enum CTraderTotalMarginCalculationType {
  MAX = 0,
  SUM = 1,
  NET = 2,
}

export enum CTraderAccountType {
  HEDGED = 0, // Allows multiple positions on a trading account for a symbol.
  NETTED = 1, // Only one position per symbol is allowed on a trading account.
  SPREAD_BETTING = 2, // Spread betting type account.
}

export enum CTraderChangeBonusType {
  BONUS_DEPOSIT = 0,
  BONUS_WITHDRAW = 1,
}

export enum CTraderChangeBalanceType {
  BALANCE_DEPOSIT = 0, // Cash deposit.
  BALANCE_WITHDRAW = 1, // Cash withdrawal.
  BALANCE_DEPOSIT_STRATEGY_COMMISSION_INNER = 3, // Received mirroring commission.
  BALANCE_WITHDRAW_STRATEGY_COMMISSION_INNER = 4, // Paid mirroring commission.
  BALANCE_DEPOSIT_IB_COMMISSIONS = 5, // For IB account. Commissions paid by trader.
  BALANCE_WITHDRAW_IB_SHARED_PERCENTAGE = 6, // For IB account. Withdrawal of commissions shared with broker.
  BALANCE_DEPOSIT_IB_SHARED_PERCENTAGE_FROM_SUB_IB = 7, // For IB account. Commissions paid by sub-ibs.
  BALANCE_DEPOSIT_IB_SHARED_PERCENTAGE_FROM_BROKER = 8, // For IB account. Commissions paid by broker.
  BALANCE_DEPOSIT_REBATE = 9, // Deposit rebate for trading volume for period.
  BALANCE_WITHDRAW_REBATE = 10, // Withdrawal of rebate.
  BALANCE_DEPOSIT_STRATEGY_COMMISSION_OUTER = 11, // Mirroring commission.
  BALANCE_WITHDRAW_STRATEGY_COMMISSION_OUTER = 12, // Mirroring commission.
  BALANCE_WITHDRAW_BONUS_COMPENSATION = 13, // For IB account. Share commission with the Broker.
  BALANCE_WITHDRAW_IB_SHARED_PERCENTAGE_TO_BROKER = 14, // IB commissions.
  BALANCE_DEPOSIT_DIVIDENDS = 15, // Deposit dividends payments.
  BALANCE_WITHDRAW_DIVIDENDS = 16, // Negative dividend charge for short position.
  BALANCE_WITHDRAW_GSL_CHARGE = 17, // Charge for guaranteedStopLoss.
  BALANCE_WITHDRAW_ROLLOVER = 18, // Charge of rollover fee for Shariah compliant accounts.
  BALANCE_DEPOSIT_NONWITHDRAWABLE_BONUS = 19, // Broker's operation to deposit bonus.
  BALANCE_WITHDRAW_NONWITHDRAWABLE_BONUS = 20, // Broker's operation to withdrawal bonus.
  BALANCE_DEPOSIT_SWAP = 21, // Deposits of negative SWAP.
  BALANCE_WITHDRAW_SWAP = 22, // SWAP charges.

  BALANCE_DEPOSIT_MANAGEMENT_FEE = 27, // Mirroring commission.
  BALANCE_WITHDRAW_MANAGEMENT_FEE = 28, // Mirroring commission. Deprecated since 7.1 in favor of BALANCE_WITHDRAW_COPY_FEE (34).
  BALANCE_DEPOSIT_PERFORMANCE_FEE = 29, // Mirroring commission.
  BALANCE_WITHDRAW_FOR_SUBACCOUNT = 30, // Withdraw for subaccount creation (cTrader Copy).
  BALANCE_DEPOSIT_TO_SUBACCOUNT = 31, // Deposit to subaccount on creation (cTrader Copy).
  BALANCE_WITHDRAW_FROM_SUBACCOUNT = 32, // Manual user's withdraw from subaccount (cTrader Copy), to parent account.
  BALANCE_DEPOSIT_FROM_SUBACCOUNT = 33, // Manual user's deposit to subaccount (cTrader Copy), from parent account.
  BALANCE_WITHDRAW_COPY_FEE = 34, // Withdrawal fees to Strategy Provider.
  BALANCE_WITHDRAW_INACTIVITY_FEE = 35, // Withdraw of inactivity fee from the balance.
  BALANCE_DEPOSIT_TRANSFER = 36, // Deposit within the same server (from another account).
  BALANCE_WITHDRAW_TRANSFER = 37, // Withdraw within the same server (to another account).
  BALANCE_DEPOSIT_CONVERTED_BONUS = 38, // Bonus being converted from virtual bonus to real deposit.
  BALANCE_DEPOSIT_NEGATIVE_BALANCE_PROTECTION = 39, // Applies if negative balance protection is configured by broker, should make balance = 0.
}

export enum CTraderLimitedRiskMarginCalculationStrategy {
  ACCORDING_TO_LEVERAGE = 0,
  ACCORDING_TO_GSL = 1,
  ACCORDING_TO_GSL_AND_LEVERAGE = 2,
}

export enum CTraderClientPermissionScope {
  SCOPE_VIEW = 0, // Allows to use only view commends. Trade is prohibited.
  SCOPE_TRADE = 1, // Allows to use all commands.
}

//
// shared
//

export enum CTraderPayloadType {
  // common intensive
  PROTO_MESSAGE = 5,
  // common commands
  ERROR_RES = 50,
  HEARTBEAT_EVENT = 51,

  PROTO_OA_APPLICATION_AUTH_REQ = 2100,
  PROTO_OA_APPLICATION_AUTH_RES = 2101,
  PROTO_OA_ACCOUNT_AUTH_REQ = 2102,
  PROTO_OA_ACCOUNT_AUTH_RES = 2103,
  PROTO_OA_VERSION_REQ = 2104,
  PROTO_OA_VERSION_RES = 2105,
  PROTO_OA_NEW_ORDER_REQ = 2106,
  PROTO_OA_TRAILING_SL_CHANGED_EVENT = 2107,
  PROTO_OA_CANCEL_ORDER_REQ = 2108,
  PROTO_OA_AMEND_ORDER_REQ = 2109,
  PROTO_OA_AMEND_POSITION_SLTP_REQ = 2110,
  PROTO_OA_CLOSE_POSITION_REQ = 2111,
  PROTO_OA_ASSET_LIST_REQ = 2112,
  PROTO_OA_ASSET_LIST_RES = 2113,
  PROTO_OA_SYMBOLS_LIST_REQ = 2114,
  PROTO_OA_SYMBOLS_LIST_RES = 2115,
  PROTO_OA_SYMBOL_BY_ID_REQ = 2116,
  PROTO_OA_SYMBOL_BY_ID_RES = 2117,
  PROTO_OA_SYMBOLS_FOR_CONVERSION_REQ = 2118,
  PROTO_OA_SYMBOLS_FOR_CONVERSION_RES = 2119,
  PROTO_OA_SYMBOL_CHANGED_EVENT = 2120,
  PROTO_OA_TRADER_REQ = 2121,
  PROTO_OA_TRADER_RES = 2122,
  PROTO_OA_TRADER_UPDATE_EVENT = 2123,
  PROTO_OA_RECONCILE_REQ = 2124,
  PROTO_OA_RECONCILE_RES = 2125,
  PROTO_OA_EXECUTION_EVENT = 2126,
  PROTO_OA_SUBSCRIBE_SPOTS_REQ = 2127,
  PROTO_OA_SUBSCRIBE_SPOTS_RES = 2128,
  PROTO_OA_UNSUBSCRIBE_SPOTS_REQ = 2129,
  PROTO_OA_UNSUBSCRIBE_SPOTS_RES = 2130,
  PROTO_OA_SPOT_EVENT = 2131,
  PROTO_OA_ORDER_ERROR_EVENT = 2132,
  PROTO_OA_DEAL_LIST_REQ = 2133,
  PROTO_OA_DEAL_LIST_RES = 2134,
  PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_REQ = 2135,
  PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_REQ = 2136,
  PROTO_OA_GET_TRENDBARS_REQ = 2137,
  PROTO_OA_GET_TRENDBARS_RES = 2138,
  PROTO_OA_EXPECTED_MARGIN_REQ = 2139,
  PROTO_OA_EXPECTED_MARGIN_RES = 2140,
  PROTO_OA_MARGIN_CHANGED_EVENT = 2141,
  PROTO_OA_ERROR_RES = 2142,
  PROTO_OA_CASH_FLOW_HISTORY_LIST_REQ = 2143,
  PROTO_OA_CASH_FLOW_HISTORY_LIST_RES = 2144,
  PROTO_OA_GET_TICKDATA_REQ = 2145,
  PROTO_OA_GET_TICKDATA_RES = 2146,
  PROTO_OA_ACCOUNTS_TOKEN_INVALIDATED_EVENT = 2147,
  PROTO_OA_CLIENT_DISCONNECT_EVENT = 2148,
  PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_REQ = 2149,
  PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_RES = 2150,
  PROTO_OA_GET_CTID_PROFILE_BY_TOKEN_REQ = 2151,
  PROTO_OA_GET_CTID_PROFILE_BY_TOKEN_RES = 2152,
  PROTO_OA_ASSET_CLASS_LIST_REQ = 2153,
  PROTO_OA_ASSET_CLASS_LIST_RES = 2154,
  PROTO_OA_DEPTH_EVENT = 2155,
  PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_REQ = 2156,
  PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_RES = 2157,
  PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_REQ = 2158,
  PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_RES = 2159,
  PROTO_OA_SYMBOL_CATEGORY_REQ = 2160,
  PROTO_OA_SYMBOL_CATEGORY_RES = 2161,
  PROTO_OA_ACCOUNT_LOGOUT_REQ = 2162,
  PROTO_OA_ACCOUNT_LOGOUT_RES = 2163,
  PROTO_OA_ACCOUNT_DISCONNECT_EVENT = 2164,
  PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_RES = 2165,
  PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_RES = 2166,
  PROTO_OA_MARGIN_CALL_LIST_REQ = 2167,
  PROTO_OA_MARGIN_CALL_LIST_RES = 2168,
  PROTO_OA_MARGIN_CALL_UPDATE_REQ = 2169,
  PROTO_OA_MARGIN_CALL_UPDATE_RES = 2170,
  PROTO_OA_MARGIN_CALL_UPDATE_EVENT = 2171,
  PROTO_OA_MARGIN_CALL_TRIGGER_EVENT = 2172,
  PROTO_OA_REFRESH_TOKEN_REQ = 2173,
  PROTO_OA_REFRESH_TOKEN_RES = 2174,
  PROTO_OA_ORDER_LIST_REQ = 2175,
  PROTO_OA_ORDER_LIST_RES = 2176,
  PROTO_OA_GET_DYNAMIC_LEVERAGE_REQ = 2177,
  PROTO_OA_GET_DYNAMIC_LEVERAGE_RES = 2178,
}

export enum CTraderErrorCode {
  // Authorization
  OA_AUTH_TOKEN_EXPIRED = 1, // When token used for account authorization is expired.
  ACCOUNT_NOT_AUTHORIZED = 2, // When account is not authorized.
  ALREADY_LOGGED_IN = 14, // When client tries to authorize after it was already authorized
  CH_CLIENT_AUTH_FAILURE = 101, // Open API client is not activated or wrong client credentials.
  CH_CLIENT_NOT_AUTHENTICATED = 102, // When a command is sent for not authorized Open API client.
  CH_CLIENT_ALREADY_AUTHENTICATED = 103, // Client is trying to authenticate twice.
  CH_ACCESS_TOKEN_INVALID = 104, // Access token is invalid.
  CH_SERVER_NOT_REACHABLE = 105, // Trading service is not available.
  CH_CTID_TRADER_ACCOUNT_NOT_FOUND = 106, // Trading account is not found.
  CH_OA_CLIENT_NOT_FOUND = 107, // Could not find this client id.

  // General
  REQUEST_FREQUENCY_EXCEEDED = 108, // Request frequency is reached.
  SERVER_IS_UNDER_MAINTENANCE = 109, // Server is under maintenance.
  CHANNEL_IS_BLOCKED = 110, // Operations are not allowed for this account.
  CONNECTIONS_LIMIT_EXCEEDED = 67, // Limit of connections is reached for this Open API client.
  WORSE_GSL_NOT_ALLOWED = 68, // Not allowed to increase risk for Positions with Guaranteed Stop Loss.
  SYMBOL_HAS_HOLIDAY = 69, // Trading disabled because symbol has holiday.

  // Pricing
  NOT_SUBSCRIBED_TO_SPOTS = 112, // When trying to subscribe to depth, trendbars, etc. without spot subscription.
  ALREADY_SUBSCRIBED = 113, // When subscription is requested for an active.
  SYMBOL_NOT_FOUND = 114, // Symbol not found.
  UNKNOWN_SYMBOL = 115, // Note: to be merged with SYMBOL_NOT_FOUND.
  INCORRECT_BOUNDARIES = 35, // When requested period (from,to) is too large or invalid values are set to from/to.

  // Trading
  NO_QUOTES = 117, // Trading cannot be done as not quotes are available. Applicable for Book B.
  NOT_ENOUGH_MONEY = 118, // Not enough funds to allocate margin.
  MAX_EXPOSURE_REACHED = 119, // Max exposure limit is reached for a {trader, symbol, side}.
  POSITION_NOT_FOUND = 120, // Position not found.
  ORDER_NOT_FOUND = 121, // Order not found.
  POSITION_NOT_OPEN = 122, // When trying to close a position that it is not open.
  POSITION_LOCKED = 123, // Position in the state that does not allow to perform an operation.
  TOO_MANY_POSITIONS = 124, // Trading account reached its limit for max number of open positions and orders.
  TRADING_BAD_VOLUME = 125, // Invalid volume.
  TRADING_BAD_STOPS = 126, // Invalid stop price.
  TRADING_BAD_PRICES = 127, // Invalid price (e.g. negative).
  TRADING_BAD_STAKE = 128, // Invalid stake volume (e.g. negative).
  PROTECTION_IS_TOO_CLOSE_TO_MARKET = 129, // Invalid protection prices.
  TRADING_BAD_EXPIRATION_DATE = 130, // Invalid expiration.
  PENDING_EXECUTION = 131, // Unable to apply changes as position has an order under execution.
  TRADING_DISABLED = 132, // Trading is blocked for the symbol.
  TRADING_NOT_ALLOWED = 133, // Trading account is in read only mode.
  UNABLE_TO_CANCEL_ORDER = 134, // Unable to cancel order.
  UNABLE_TO_AMEND_ORDER = 135, // Unable to amend order.
  SHORT_SELLING_NOT_ALLOWED = 136, // Short selling is not allowed.
}

export enum CTraderCommonErrorCode {
  UNKNOWN_ERROR = 1, // Generic error.
  UNSUPPORTED_MESSAGE = 2, // Message is not supported. Wrong message.
  INVALID_REQUEST = 3, // Generic error.  Usually used when input value is not correct.
  TIMEOUT_ERROR = 5, // Deal execution is reached timeout and rejected.
  ENTITY_NOT_FOUND = 6, // Generic error for requests by id.
  CANT_ROUTE_REQUEST = 7, // Connection to Server is lost or not supported.
  FRAME_TOO_LONG = 8, // Message is too large.
  MARKET_CLOSED = 9, // Market is closed.
  CONCURRENT_MODIFICATION = 10, // Order is blocked (e.g. under execution) and change cannot be applied.
  BLOCKED_PAYLOAD_TYPE = 11, // Message is blocked by server.
}
