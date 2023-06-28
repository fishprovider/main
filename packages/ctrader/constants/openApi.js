/* eslint-disable max-len */
//
// order
//
var TradeSide;
(function (TradeSide) {
    TradeSide[TradeSide["BUY"] = 1] = "BUY";
    TradeSide[TradeSide["SELL"] = 2] = "SELL";
})(TradeSide || (TradeSide = {}));
var OrderType;
(function (OrderType) {
    OrderType[OrderType["MARKET"] = 1] = "MARKET";
    OrderType[OrderType["LIMIT"] = 2] = "LIMIT";
    OrderType[OrderType["STOP"] = 3] = "STOP";
    OrderType[OrderType["STOP_LOSS_TAKE_PROFIT"] = 4] = "STOP_LOSS_TAKE_PROFIT";
    OrderType[OrderType["MARKET_RANGE"] = 5] = "MARKET_RANGE";
    OrderType[OrderType["STOP_LIMIT"] = 6] = "STOP_LIMIT";
})(OrderType || (OrderType = {}));
var ExecutionType;
(function (ExecutionType) {
    ExecutionType[ExecutionType["ORDER_ACCEPTED"] = 2] = "ORDER_ACCEPTED";
    ExecutionType[ExecutionType["ORDER_FILLED"] = 3] = "ORDER_FILLED";
    ExecutionType[ExecutionType["ORDER_REPLACED"] = 4] = "ORDER_REPLACED";
    ExecutionType[ExecutionType["ORDER_CANCELLED"] = 5] = "ORDER_CANCELLED";
    ExecutionType[ExecutionType["ORDER_EXPIRED"] = 6] = "ORDER_EXPIRED";
    ExecutionType[ExecutionType["ORDER_REJECTED"] = 7] = "ORDER_REJECTED";
    ExecutionType[ExecutionType["ORDER_CANCEL_REJECTED"] = 8] = "ORDER_CANCEL_REJECTED";
    ExecutionType[ExecutionType["SWAP"] = 9] = "SWAP";
    ExecutionType[ExecutionType["DEPOSIT_WITHDRAW"] = 10] = "DEPOSIT_WITHDRAW";
    ExecutionType[ExecutionType["ORDER_PARTIAL_FILL"] = 11] = "ORDER_PARTIAL_FILL";
    ExecutionType[ExecutionType["BONUS_DEPOSIT_WITHDRAW"] = 12] = "BONUS_DEPOSIT_WITHDRAW";
})(ExecutionType || (ExecutionType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["ORDER_STATUS_ACCEPTED"] = 1] = "ORDER_STATUS_ACCEPTED";
    OrderStatus[OrderStatus["ORDER_STATUS_FILLED"] = 2] = "ORDER_STATUS_FILLED";
    OrderStatus[OrderStatus["ORDER_STATUS_REJECTED"] = 3] = "ORDER_STATUS_REJECTED";
    OrderStatus[OrderStatus["ORDER_STATUS_EXPIRED"] = 4] = "ORDER_STATUS_EXPIRED";
    OrderStatus[OrderStatus["ORDER_STATUS_CANCELLED"] = 5] = "ORDER_STATUS_CANCELLED";
})(OrderStatus || (OrderStatus = {}));
var PositionStatus;
(function (PositionStatus) {
    PositionStatus[PositionStatus["POSITION_STATUS_OPEN"] = 1] = "POSITION_STATUS_OPEN";
    PositionStatus[PositionStatus["POSITION_STATUS_CLOSED"] = 2] = "POSITION_STATUS_CLOSED";
    PositionStatus[PositionStatus["POSITION_STATUS_CREATED"] = 3] = "POSITION_STATUS_CREATED";
    PositionStatus[PositionStatus["POSITION_STATUS_ERROR"] = 4] = "POSITION_STATUS_ERROR";
})(PositionStatus || (PositionStatus = {}));
var DealStatus;
(function (DealStatus) {
    DealStatus[DealStatus["FILLED"] = 2] = "FILLED";
    DealStatus[DealStatus["PARTIALLY_FILLED"] = 3] = "PARTIALLY_FILLED";
    DealStatus[DealStatus["REJECTED"] = 4] = "REJECTED";
    DealStatus[DealStatus["INTERNALLY_REJECTED"] = 5] = "INTERNALLY_REJECTED";
    DealStatus[DealStatus["ERROR"] = 6] = "ERROR";
    DealStatus[DealStatus["MISSED"] = 7] = "MISSED";
})(DealStatus || (DealStatus = {}));
var TimeInForce;
(function (TimeInForce) {
    TimeInForce[TimeInForce["GOOD_TILL_DATE"] = 1] = "GOOD_TILL_DATE";
    TimeInForce[TimeInForce["GOOD_TILL_CANCEL"] = 2] = "GOOD_TILL_CANCEL";
    TimeInForce[TimeInForce["IMMEDIATE_OR_CANCEL"] = 3] = "IMMEDIATE_OR_CANCEL";
    TimeInForce[TimeInForce["FILL_OR_KILL"] = 4] = "FILL_OR_KILL";
    TimeInForce[TimeInForce["MARKET_ON_OPEN"] = 5] = "MARKET_ON_OPEN";
})(TimeInForce || (TimeInForce = {}));
//
// price
//
var QuoteType;
(function (QuoteType) {
    QuoteType[QuoteType["BID"] = 1] = "BID";
    QuoteType[QuoteType["ASK"] = 2] = "ASK";
})(QuoteType || (QuoteType = {}));
var TrendbarPeriod;
(function (TrendbarPeriod) {
    TrendbarPeriod[TrendbarPeriod["M1"] = 1] = "M1";
    TrendbarPeriod[TrendbarPeriod["M2"] = 2] = "M2";
    TrendbarPeriod[TrendbarPeriod["M3"] = 3] = "M3";
    TrendbarPeriod[TrendbarPeriod["M4"] = 4] = "M4";
    TrendbarPeriod[TrendbarPeriod["M5"] = 5] = "M5";
    TrendbarPeriod[TrendbarPeriod["M10"] = 6] = "M10";
    TrendbarPeriod[TrendbarPeriod["M15"] = 7] = "M15";
    TrendbarPeriod[TrendbarPeriod["M30"] = 8] = "M30";
    TrendbarPeriod[TrendbarPeriod["H1"] = 9] = "H1";
    TrendbarPeriod[TrendbarPeriod["H4"] = 10] = "H4";
    TrendbarPeriod[TrendbarPeriod["H12"] = 11] = "H12";
    TrendbarPeriod[TrendbarPeriod["D1"] = 12] = "D1";
    TrendbarPeriod[TrendbarPeriod["W1"] = 13] = "W1";
    TrendbarPeriod[TrendbarPeriod["MN1"] = 14] = "MN1";
})(TrendbarPeriod || (TrendbarPeriod = {}));
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek[DayOfWeek["NONE"] = 0] = "NONE";
    DayOfWeek[DayOfWeek["MONDAY"] = 1] = "MONDAY";
    DayOfWeek[DayOfWeek["TUESDAY"] = 2] = "TUESDAY";
    DayOfWeek[DayOfWeek["WEDNESDAY"] = 3] = "WEDNESDAY";
    DayOfWeek[DayOfWeek["THURSDAY"] = 4] = "THURSDAY";
    DayOfWeek[DayOfWeek["FRIDAY"] = 5] = "FRIDAY";
    DayOfWeek[DayOfWeek["SATURDAY"] = 6] = "SATURDAY";
    DayOfWeek[DayOfWeek["SUNDAY"] = 7] = "SUNDAY";
})(DayOfWeek || (DayOfWeek = {}));
var CommissionType;
(function (CommissionType) {
    CommissionType[CommissionType["USD_PER_MILLION_USD"] = 1] = "USD_PER_MILLION_USD";
    CommissionType[CommissionType["USD_PER_LOT"] = 2] = "USD_PER_LOT";
    CommissionType[CommissionType["PERCENTAGE_OF_VALUE"] = 3] = "PERCENTAGE_OF_VALUE";
    CommissionType[CommissionType["QUOTE_CCY_PER_LOT"] = 4] = "QUOTE_CCY_PER_LOT";
})(CommissionType || (CommissionType = {}));
var MinCommissionType;
(function (MinCommissionType) {
    MinCommissionType[MinCommissionType["CURRENCY"] = 1] = "CURRENCY";
    MinCommissionType[MinCommissionType["QUOTE_CURRENCY"] = 2] = "QUOTE_CURRENCY";
})(MinCommissionType || (MinCommissionType = {}));
var SymbolDistanceType;
(function (SymbolDistanceType) {
    SymbolDistanceType[SymbolDistanceType["SYMBOL_DISTANCE_IN_POINTS"] = 1] = "SYMBOL_DISTANCE_IN_POINTS";
    SymbolDistanceType[SymbolDistanceType["SYMBOL_DISTANCE_IN_PERCENTAGE"] = 2] = "SYMBOL_DISTANCE_IN_PERCENTAGE";
})(SymbolDistanceType || (SymbolDistanceType = {}));
var TradingMode;
(function (TradingMode) {
    TradingMode[TradingMode["ENABLED"] = 0] = "ENABLED";
    TradingMode[TradingMode["DISABLED_WITHOUT_PENDINGS_EXECUTION"] = 1] = "DISABLED_WITHOUT_PENDINGS_EXECUTION";
    TradingMode[TradingMode["DISABLED_WITH_PENDINGS_EXECUTION"] = 2] = "DISABLED_WITH_PENDINGS_EXECUTION";
    TradingMode[TradingMode["CLOSE_ONLY_MODE"] = 3] = "CLOSE_ONLY_MODE";
})(TradingMode || (TradingMode = {}));
var SwapCalculationType;
(function (SwapCalculationType) {
    SwapCalculationType[SwapCalculationType["PIPS"] = 0] = "PIPS";
    SwapCalculationType[SwapCalculationType["PERCENTAGE"] = 1] = "PERCENTAGE";
})(SwapCalculationType || (SwapCalculationType = {}));
var OrderTriggerMethod;
(function (OrderTriggerMethod) {
    OrderTriggerMethod[OrderTriggerMethod["TRADE"] = 1] = "TRADE";
    OrderTriggerMethod[OrderTriggerMethod["OPPOSITE"] = 2] = "OPPOSITE";
    OrderTriggerMethod[OrderTriggerMethod["DOUBLE_TRADE"] = 3] = "DOUBLE_TRADE";
    OrderTriggerMethod[OrderTriggerMethod["DOUBLE_OPPOSITE"] = 4] = "DOUBLE_OPPOSITE";
})(OrderTriggerMethod || (OrderTriggerMethod = {}));
//
// account
//
var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["MARGIN_LEVEL_THRESHOLD_1"] = 61] = "MARGIN_LEVEL_THRESHOLD_1";
    NotificationType[NotificationType["MARGIN_LEVEL_THRESHOLD_2"] = 62] = "MARGIN_LEVEL_THRESHOLD_2";
    NotificationType[NotificationType["MARGIN_LEVEL_THRESHOLD_3"] = 63] = "MARGIN_LEVEL_THRESHOLD_3";
})(NotificationType || (NotificationType = {}));
var AccessRights;
(function (AccessRights) {
    AccessRights[AccessRights["FULL_ACCESS"] = 0] = "FULL_ACCESS";
    AccessRights[AccessRights["CLOSE_ONLY"] = 1] = "CLOSE_ONLY";
    AccessRights[AccessRights["NO_TRADING"] = 2] = "NO_TRADING";
    AccessRights[AccessRights["NO_LOGIN"] = 3] = "NO_LOGIN";
})(AccessRights || (AccessRights = {}));
var TotalMarginCalculationType;
(function (TotalMarginCalculationType) {
    TotalMarginCalculationType[TotalMarginCalculationType["MAX"] = 0] = "MAX";
    TotalMarginCalculationType[TotalMarginCalculationType["SUM"] = 1] = "SUM";
    TotalMarginCalculationType[TotalMarginCalculationType["NET"] = 2] = "NET";
})(TotalMarginCalculationType || (TotalMarginCalculationType = {}));
var AccountType;
(function (AccountType) {
    AccountType[AccountType["HEDGED"] = 0] = "HEDGED";
    AccountType[AccountType["NETTED"] = 1] = "NETTED";
    AccountType[AccountType["SPREAD_BETTING"] = 2] = "SPREAD_BETTING";
})(AccountType || (AccountType = {}));
var ChangeBonusType;
(function (ChangeBonusType) {
    ChangeBonusType[ChangeBonusType["BONUS_DEPOSIT"] = 0] = "BONUS_DEPOSIT";
    ChangeBonusType[ChangeBonusType["BONUS_WITHDRAW"] = 1] = "BONUS_WITHDRAW";
})(ChangeBonusType || (ChangeBonusType = {}));
var ChangeBalanceType;
(function (ChangeBalanceType) {
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT"] = 0] = "BALANCE_DEPOSIT";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW"] = 1] = "BALANCE_WITHDRAW";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_STRATEGY_COMMISSION_INNER"] = 3] = "BALANCE_DEPOSIT_STRATEGY_COMMISSION_INNER";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_STRATEGY_COMMISSION_INNER"] = 4] = "BALANCE_WITHDRAW_STRATEGY_COMMISSION_INNER";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_IB_COMMISSIONS"] = 5] = "BALANCE_DEPOSIT_IB_COMMISSIONS";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_IB_SHARED_PERCENTAGE"] = 6] = "BALANCE_WITHDRAW_IB_SHARED_PERCENTAGE";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_IB_SHARED_PERCENTAGE_FROM_SUB_IB"] = 7] = "BALANCE_DEPOSIT_IB_SHARED_PERCENTAGE_FROM_SUB_IB";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_IB_SHARED_PERCENTAGE_FROM_BROKER"] = 8] = "BALANCE_DEPOSIT_IB_SHARED_PERCENTAGE_FROM_BROKER";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_REBATE"] = 9] = "BALANCE_DEPOSIT_REBATE";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_REBATE"] = 10] = "BALANCE_WITHDRAW_REBATE";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_STRATEGY_COMMISSION_OUTER"] = 11] = "BALANCE_DEPOSIT_STRATEGY_COMMISSION_OUTER";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_STRATEGY_COMMISSION_OUTER"] = 12] = "BALANCE_WITHDRAW_STRATEGY_COMMISSION_OUTER";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_BONUS_COMPENSATION"] = 13] = "BALANCE_WITHDRAW_BONUS_COMPENSATION";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_IB_SHARED_PERCENTAGE_TO_BROKER"] = 14] = "BALANCE_WITHDRAW_IB_SHARED_PERCENTAGE_TO_BROKER";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_DIVIDENDS"] = 15] = "BALANCE_DEPOSIT_DIVIDENDS";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_DIVIDENDS"] = 16] = "BALANCE_WITHDRAW_DIVIDENDS";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_GSL_CHARGE"] = 17] = "BALANCE_WITHDRAW_GSL_CHARGE";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_ROLLOVER"] = 18] = "BALANCE_WITHDRAW_ROLLOVER";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_NONWITHDRAWABLE_BONUS"] = 19] = "BALANCE_DEPOSIT_NONWITHDRAWABLE_BONUS";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_NONWITHDRAWABLE_BONUS"] = 20] = "BALANCE_WITHDRAW_NONWITHDRAWABLE_BONUS";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_SWAP"] = 21] = "BALANCE_DEPOSIT_SWAP";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_SWAP"] = 22] = "BALANCE_WITHDRAW_SWAP";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_MANAGEMENT_FEE"] = 27] = "BALANCE_DEPOSIT_MANAGEMENT_FEE";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_MANAGEMENT_FEE"] = 28] = "BALANCE_WITHDRAW_MANAGEMENT_FEE";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_PERFORMANCE_FEE"] = 29] = "BALANCE_DEPOSIT_PERFORMANCE_FEE";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_FOR_SUBACCOUNT"] = 30] = "BALANCE_WITHDRAW_FOR_SUBACCOUNT";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_TO_SUBACCOUNT"] = 31] = "BALANCE_DEPOSIT_TO_SUBACCOUNT";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_FROM_SUBACCOUNT"] = 32] = "BALANCE_WITHDRAW_FROM_SUBACCOUNT";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_FROM_SUBACCOUNT"] = 33] = "BALANCE_DEPOSIT_FROM_SUBACCOUNT";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_COPY_FEE"] = 34] = "BALANCE_WITHDRAW_COPY_FEE";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_INACTIVITY_FEE"] = 35] = "BALANCE_WITHDRAW_INACTIVITY_FEE";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_TRANSFER"] = 36] = "BALANCE_DEPOSIT_TRANSFER";
    ChangeBalanceType[ChangeBalanceType["BALANCE_WITHDRAW_TRANSFER"] = 37] = "BALANCE_WITHDRAW_TRANSFER";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_CONVERTED_BONUS"] = 38] = "BALANCE_DEPOSIT_CONVERTED_BONUS";
    ChangeBalanceType[ChangeBalanceType["BALANCE_DEPOSIT_NEGATIVE_BALANCE_PROTECTION"] = 39] = "BALANCE_DEPOSIT_NEGATIVE_BALANCE_PROTECTION";
})(ChangeBalanceType || (ChangeBalanceType = {}));
var LimitedRiskMarginCalculationStrategy;
(function (LimitedRiskMarginCalculationStrategy) {
    LimitedRiskMarginCalculationStrategy[LimitedRiskMarginCalculationStrategy["ACCORDING_TO_LEVERAGE"] = 0] = "ACCORDING_TO_LEVERAGE";
    LimitedRiskMarginCalculationStrategy[LimitedRiskMarginCalculationStrategy["ACCORDING_TO_GSL"] = 1] = "ACCORDING_TO_GSL";
    LimitedRiskMarginCalculationStrategy[LimitedRiskMarginCalculationStrategy["ACCORDING_TO_GSL_AND_LEVERAGE"] = 2] = "ACCORDING_TO_GSL_AND_LEVERAGE";
})(LimitedRiskMarginCalculationStrategy || (LimitedRiskMarginCalculationStrategy = {}));
var ClientPermissionScope;
(function (ClientPermissionScope) {
    ClientPermissionScope[ClientPermissionScope["SCOPE_VIEW"] = 0] = "SCOPE_VIEW";
    ClientPermissionScope[ClientPermissionScope["SCOPE_TRADE"] = 1] = "SCOPE_TRADE";
})(ClientPermissionScope || (ClientPermissionScope = {}));
//
// shared
//
var PayloadType;
(function (PayloadType) {
    // common intensive
    PayloadType[PayloadType["PROTO_MESSAGE"] = 5] = "PROTO_MESSAGE";
    // common commands
    PayloadType[PayloadType["ERROR_RES"] = 50] = "ERROR_RES";
    PayloadType[PayloadType["HEARTBEAT_EVENT"] = 51] = "HEARTBEAT_EVENT";
    PayloadType[PayloadType["PROTO_OA_APPLICATION_AUTH_REQ"] = 2100] = "PROTO_OA_APPLICATION_AUTH_REQ";
    PayloadType[PayloadType["PROTO_OA_APPLICATION_AUTH_RES"] = 2101] = "PROTO_OA_APPLICATION_AUTH_RES";
    PayloadType[PayloadType["PROTO_OA_ACCOUNT_AUTH_REQ"] = 2102] = "PROTO_OA_ACCOUNT_AUTH_REQ";
    PayloadType[PayloadType["PROTO_OA_ACCOUNT_AUTH_RES"] = 2103] = "PROTO_OA_ACCOUNT_AUTH_RES";
    PayloadType[PayloadType["PROTO_OA_VERSION_REQ"] = 2104] = "PROTO_OA_VERSION_REQ";
    PayloadType[PayloadType["PROTO_OA_VERSION_RES"] = 2105] = "PROTO_OA_VERSION_RES";
    PayloadType[PayloadType["PROTO_OA_NEW_ORDER_REQ"] = 2106] = "PROTO_OA_NEW_ORDER_REQ";
    PayloadType[PayloadType["PROTO_OA_TRAILING_SL_CHANGED_EVENT"] = 2107] = "PROTO_OA_TRAILING_SL_CHANGED_EVENT";
    PayloadType[PayloadType["PROTO_OA_CANCEL_ORDER_REQ"] = 2108] = "PROTO_OA_CANCEL_ORDER_REQ";
    PayloadType[PayloadType["PROTO_OA_AMEND_ORDER_REQ"] = 2109] = "PROTO_OA_AMEND_ORDER_REQ";
    PayloadType[PayloadType["PROTO_OA_AMEND_POSITION_SLTP_REQ"] = 2110] = "PROTO_OA_AMEND_POSITION_SLTP_REQ";
    PayloadType[PayloadType["PROTO_OA_CLOSE_POSITION_REQ"] = 2111] = "PROTO_OA_CLOSE_POSITION_REQ";
    PayloadType[PayloadType["PROTO_OA_ASSET_LIST_REQ"] = 2112] = "PROTO_OA_ASSET_LIST_REQ";
    PayloadType[PayloadType["PROTO_OA_ASSET_LIST_RES"] = 2113] = "PROTO_OA_ASSET_LIST_RES";
    PayloadType[PayloadType["PROTO_OA_SYMBOLS_LIST_REQ"] = 2114] = "PROTO_OA_SYMBOLS_LIST_REQ";
    PayloadType[PayloadType["PROTO_OA_SYMBOLS_LIST_RES"] = 2115] = "PROTO_OA_SYMBOLS_LIST_RES";
    PayloadType[PayloadType["PROTO_OA_SYMBOL_BY_ID_REQ"] = 2116] = "PROTO_OA_SYMBOL_BY_ID_REQ";
    PayloadType[PayloadType["PROTO_OA_SYMBOL_BY_ID_RES"] = 2117] = "PROTO_OA_SYMBOL_BY_ID_RES";
    PayloadType[PayloadType["PROTO_OA_SYMBOLS_FOR_CONVERSION_REQ"] = 2118] = "PROTO_OA_SYMBOLS_FOR_CONVERSION_REQ";
    PayloadType[PayloadType["PROTO_OA_SYMBOLS_FOR_CONVERSION_RES"] = 2119] = "PROTO_OA_SYMBOLS_FOR_CONVERSION_RES";
    PayloadType[PayloadType["PROTO_OA_SYMBOL_CHANGED_EVENT"] = 2120] = "PROTO_OA_SYMBOL_CHANGED_EVENT";
    PayloadType[PayloadType["PROTO_OA_TRADER_REQ"] = 2121] = "PROTO_OA_TRADER_REQ";
    PayloadType[PayloadType["PROTO_OA_TRADER_RES"] = 2122] = "PROTO_OA_TRADER_RES";
    PayloadType[PayloadType["PROTO_OA_TRADER_UPDATE_EVENT"] = 2123] = "PROTO_OA_TRADER_UPDATE_EVENT";
    PayloadType[PayloadType["PROTO_OA_RECONCILE_REQ"] = 2124] = "PROTO_OA_RECONCILE_REQ";
    PayloadType[PayloadType["PROTO_OA_RECONCILE_RES"] = 2125] = "PROTO_OA_RECONCILE_RES";
    PayloadType[PayloadType["PROTO_OA_EXECUTION_EVENT"] = 2126] = "PROTO_OA_EXECUTION_EVENT";
    PayloadType[PayloadType["PROTO_OA_SUBSCRIBE_SPOTS_REQ"] = 2127] = "PROTO_OA_SUBSCRIBE_SPOTS_REQ";
    PayloadType[PayloadType["PROTO_OA_SUBSCRIBE_SPOTS_RES"] = 2128] = "PROTO_OA_SUBSCRIBE_SPOTS_RES";
    PayloadType[PayloadType["PROTO_OA_UNSUBSCRIBE_SPOTS_REQ"] = 2129] = "PROTO_OA_UNSUBSCRIBE_SPOTS_REQ";
    PayloadType[PayloadType["PROTO_OA_UNSUBSCRIBE_SPOTS_RES"] = 2130] = "PROTO_OA_UNSUBSCRIBE_SPOTS_RES";
    PayloadType[PayloadType["PROTO_OA_SPOT_EVENT"] = 2131] = "PROTO_OA_SPOT_EVENT";
    PayloadType[PayloadType["PROTO_OA_ORDER_ERROR_EVENT"] = 2132] = "PROTO_OA_ORDER_ERROR_EVENT";
    PayloadType[PayloadType["PROTO_OA_DEAL_LIST_REQ"] = 2133] = "PROTO_OA_DEAL_LIST_REQ";
    PayloadType[PayloadType["PROTO_OA_DEAL_LIST_RES"] = 2134] = "PROTO_OA_DEAL_LIST_RES";
    PayloadType[PayloadType["PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_REQ"] = 2135] = "PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_REQ";
    PayloadType[PayloadType["PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_REQ"] = 2136] = "PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_REQ";
    PayloadType[PayloadType["PROTO_OA_GET_TRENDBARS_REQ"] = 2137] = "PROTO_OA_GET_TRENDBARS_REQ";
    PayloadType[PayloadType["PROTO_OA_GET_TRENDBARS_RES"] = 2138] = "PROTO_OA_GET_TRENDBARS_RES";
    PayloadType[PayloadType["PROTO_OA_EXPECTED_MARGIN_REQ"] = 2139] = "PROTO_OA_EXPECTED_MARGIN_REQ";
    PayloadType[PayloadType["PROTO_OA_EXPECTED_MARGIN_RES"] = 2140] = "PROTO_OA_EXPECTED_MARGIN_RES";
    PayloadType[PayloadType["PROTO_OA_MARGIN_CHANGED_EVENT"] = 2141] = "PROTO_OA_MARGIN_CHANGED_EVENT";
    PayloadType[PayloadType["PROTO_OA_ERROR_RES"] = 2142] = "PROTO_OA_ERROR_RES";
    PayloadType[PayloadType["PROTO_OA_CASH_FLOW_HISTORY_LIST_REQ"] = 2143] = "PROTO_OA_CASH_FLOW_HISTORY_LIST_REQ";
    PayloadType[PayloadType["PROTO_OA_CASH_FLOW_HISTORY_LIST_RES"] = 2144] = "PROTO_OA_CASH_FLOW_HISTORY_LIST_RES";
    PayloadType[PayloadType["PROTO_OA_GET_TICKDATA_REQ"] = 2145] = "PROTO_OA_GET_TICKDATA_REQ";
    PayloadType[PayloadType["PROTO_OA_GET_TICKDATA_RES"] = 2146] = "PROTO_OA_GET_TICKDATA_RES";
    PayloadType[PayloadType["PROTO_OA_ACCOUNTS_TOKEN_INVALIDATED_EVENT"] = 2147] = "PROTO_OA_ACCOUNTS_TOKEN_INVALIDATED_EVENT";
    PayloadType[PayloadType["PROTO_OA_CLIENT_DISCONNECT_EVENT"] = 2148] = "PROTO_OA_CLIENT_DISCONNECT_EVENT";
    PayloadType[PayloadType["PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_REQ"] = 2149] = "PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_REQ";
    PayloadType[PayloadType["PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_RES"] = 2150] = "PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_RES";
    PayloadType[PayloadType["PROTO_OA_GET_CTID_PROFILE_BY_TOKEN_REQ"] = 2151] = "PROTO_OA_GET_CTID_PROFILE_BY_TOKEN_REQ";
    PayloadType[PayloadType["PROTO_OA_GET_CTID_PROFILE_BY_TOKEN_RES"] = 2152] = "PROTO_OA_GET_CTID_PROFILE_BY_TOKEN_RES";
    PayloadType[PayloadType["PROTO_OA_ASSET_CLASS_LIST_REQ"] = 2153] = "PROTO_OA_ASSET_CLASS_LIST_REQ";
    PayloadType[PayloadType["PROTO_OA_ASSET_CLASS_LIST_RES"] = 2154] = "PROTO_OA_ASSET_CLASS_LIST_RES";
    PayloadType[PayloadType["PROTO_OA_DEPTH_EVENT"] = 2155] = "PROTO_OA_DEPTH_EVENT";
    PayloadType[PayloadType["PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_REQ"] = 2156] = "PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_REQ";
    PayloadType[PayloadType["PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_RES"] = 2157] = "PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_RES";
    PayloadType[PayloadType["PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_REQ"] = 2158] = "PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_REQ";
    PayloadType[PayloadType["PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_RES"] = 2159] = "PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_RES";
    PayloadType[PayloadType["PROTO_OA_SYMBOL_CATEGORY_REQ"] = 2160] = "PROTO_OA_SYMBOL_CATEGORY_REQ";
    PayloadType[PayloadType["PROTO_OA_SYMBOL_CATEGORY_RES"] = 2161] = "PROTO_OA_SYMBOL_CATEGORY_RES";
    PayloadType[PayloadType["PROTO_OA_ACCOUNT_LOGOUT_REQ"] = 2162] = "PROTO_OA_ACCOUNT_LOGOUT_REQ";
    PayloadType[PayloadType["PROTO_OA_ACCOUNT_LOGOUT_RES"] = 2163] = "PROTO_OA_ACCOUNT_LOGOUT_RES";
    PayloadType[PayloadType["PROTO_OA_ACCOUNT_DISCONNECT_EVENT"] = 2164] = "PROTO_OA_ACCOUNT_DISCONNECT_EVENT";
    PayloadType[PayloadType["PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_RES"] = 2165] = "PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_RES";
    PayloadType[PayloadType["PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_RES"] = 2166] = "PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_RES";
    PayloadType[PayloadType["PROTO_OA_MARGIN_CALL_LIST_REQ"] = 2167] = "PROTO_OA_MARGIN_CALL_LIST_REQ";
    PayloadType[PayloadType["PROTO_OA_MARGIN_CALL_LIST_RES"] = 2168] = "PROTO_OA_MARGIN_CALL_LIST_RES";
    PayloadType[PayloadType["PROTO_OA_MARGIN_CALL_UPDATE_REQ"] = 2169] = "PROTO_OA_MARGIN_CALL_UPDATE_REQ";
    PayloadType[PayloadType["PROTO_OA_MARGIN_CALL_UPDATE_RES"] = 2170] = "PROTO_OA_MARGIN_CALL_UPDATE_RES";
    PayloadType[PayloadType["PROTO_OA_MARGIN_CALL_UPDATE_EVENT"] = 2171] = "PROTO_OA_MARGIN_CALL_UPDATE_EVENT";
    PayloadType[PayloadType["PROTO_OA_MARGIN_CALL_TRIGGER_EVENT"] = 2172] = "PROTO_OA_MARGIN_CALL_TRIGGER_EVENT";
    PayloadType[PayloadType["PROTO_OA_REFRESH_TOKEN_REQ"] = 2173] = "PROTO_OA_REFRESH_TOKEN_REQ";
    PayloadType[PayloadType["PROTO_OA_REFRESH_TOKEN_RES"] = 2174] = "PROTO_OA_REFRESH_TOKEN_RES";
    PayloadType[PayloadType["PROTO_OA_ORDER_LIST_REQ"] = 2175] = "PROTO_OA_ORDER_LIST_REQ";
    PayloadType[PayloadType["PROTO_OA_ORDER_LIST_RES"] = 2176] = "PROTO_OA_ORDER_LIST_RES";
    PayloadType[PayloadType["PROTO_OA_GET_DYNAMIC_LEVERAGE_REQ"] = 2177] = "PROTO_OA_GET_DYNAMIC_LEVERAGE_REQ";
    PayloadType[PayloadType["PROTO_OA_GET_DYNAMIC_LEVERAGE_RES"] = 2178] = "PROTO_OA_GET_DYNAMIC_LEVERAGE_RES";
})(PayloadType || (PayloadType = {}));
var ErrorCode;
(function (ErrorCode) {
    // Authorization
    ErrorCode[ErrorCode["OA_AUTH_TOKEN_EXPIRED"] = 1] = "OA_AUTH_TOKEN_EXPIRED";
    ErrorCode[ErrorCode["ACCOUNT_NOT_AUTHORIZED"] = 2] = "ACCOUNT_NOT_AUTHORIZED";
    ErrorCode[ErrorCode["ALREADY_LOGGED_IN"] = 14] = "ALREADY_LOGGED_IN";
    ErrorCode[ErrorCode["CH_CLIENT_AUTH_FAILURE"] = 101] = "CH_CLIENT_AUTH_FAILURE";
    ErrorCode[ErrorCode["CH_CLIENT_NOT_AUTHENTICATED"] = 102] = "CH_CLIENT_NOT_AUTHENTICATED";
    ErrorCode[ErrorCode["CH_CLIENT_ALREADY_AUTHENTICATED"] = 103] = "CH_CLIENT_ALREADY_AUTHENTICATED";
    ErrorCode[ErrorCode["CH_ACCESS_TOKEN_INVALID"] = 104] = "CH_ACCESS_TOKEN_INVALID";
    ErrorCode[ErrorCode["CH_SERVER_NOT_REACHABLE"] = 105] = "CH_SERVER_NOT_REACHABLE";
    ErrorCode[ErrorCode["CH_CTID_TRADER_ACCOUNT_NOT_FOUND"] = 106] = "CH_CTID_TRADER_ACCOUNT_NOT_FOUND";
    ErrorCode[ErrorCode["CH_OA_CLIENT_NOT_FOUND"] = 107] = "CH_OA_CLIENT_NOT_FOUND";
    // General
    ErrorCode[ErrorCode["REQUEST_FREQUENCY_EXCEEDED"] = 108] = "REQUEST_FREQUENCY_EXCEEDED";
    ErrorCode[ErrorCode["SERVER_IS_UNDER_MAINTENANCE"] = 109] = "SERVER_IS_UNDER_MAINTENANCE";
    ErrorCode[ErrorCode["CHANNEL_IS_BLOCKED"] = 110] = "CHANNEL_IS_BLOCKED";
    ErrorCode[ErrorCode["CONNECTIONS_LIMIT_EXCEEDED"] = 67] = "CONNECTIONS_LIMIT_EXCEEDED";
    ErrorCode[ErrorCode["WORSE_GSL_NOT_ALLOWED"] = 68] = "WORSE_GSL_NOT_ALLOWED";
    ErrorCode[ErrorCode["SYMBOL_HAS_HOLIDAY"] = 69] = "SYMBOL_HAS_HOLIDAY";
    // Pricing
    ErrorCode[ErrorCode["NOT_SUBSCRIBED_TO_SPOTS"] = 112] = "NOT_SUBSCRIBED_TO_SPOTS";
    ErrorCode[ErrorCode["ALREADY_SUBSCRIBED"] = 113] = "ALREADY_SUBSCRIBED";
    ErrorCode[ErrorCode["SYMBOL_NOT_FOUND"] = 114] = "SYMBOL_NOT_FOUND";
    ErrorCode[ErrorCode["UNKNOWN_SYMBOL"] = 115] = "UNKNOWN_SYMBOL";
    ErrorCode[ErrorCode["INCORRECT_BOUNDARIES"] = 35] = "INCORRECT_BOUNDARIES";
    // Trading
    ErrorCode[ErrorCode["NO_QUOTES"] = 117] = "NO_QUOTES";
    ErrorCode[ErrorCode["NOT_ENOUGH_MONEY"] = 118] = "NOT_ENOUGH_MONEY";
    ErrorCode[ErrorCode["MAX_EXPOSURE_REACHED"] = 119] = "MAX_EXPOSURE_REACHED";
    ErrorCode[ErrorCode["POSITION_NOT_FOUND"] = 120] = "POSITION_NOT_FOUND";
    ErrorCode[ErrorCode["ORDER_NOT_FOUND"] = 121] = "ORDER_NOT_FOUND";
    ErrorCode[ErrorCode["POSITION_NOT_OPEN"] = 122] = "POSITION_NOT_OPEN";
    ErrorCode[ErrorCode["POSITION_LOCKED"] = 123] = "POSITION_LOCKED";
    ErrorCode[ErrorCode["TOO_MANY_POSITIONS"] = 124] = "TOO_MANY_POSITIONS";
    ErrorCode[ErrorCode["TRADING_BAD_VOLUME"] = 125] = "TRADING_BAD_VOLUME";
    ErrorCode[ErrorCode["TRADING_BAD_STOPS"] = 126] = "TRADING_BAD_STOPS";
    ErrorCode[ErrorCode["TRADING_BAD_PRICES"] = 127] = "TRADING_BAD_PRICES";
    ErrorCode[ErrorCode["TRADING_BAD_STAKE"] = 128] = "TRADING_BAD_STAKE";
    ErrorCode[ErrorCode["PROTECTION_IS_TOO_CLOSE_TO_MARKET"] = 129] = "PROTECTION_IS_TOO_CLOSE_TO_MARKET";
    ErrorCode[ErrorCode["TRADING_BAD_EXPIRATION_DATE"] = 130] = "TRADING_BAD_EXPIRATION_DATE";
    ErrorCode[ErrorCode["PENDING_EXECUTION"] = 131] = "PENDING_EXECUTION";
    ErrorCode[ErrorCode["TRADING_DISABLED"] = 132] = "TRADING_DISABLED";
    ErrorCode[ErrorCode["TRADING_NOT_ALLOWED"] = 133] = "TRADING_NOT_ALLOWED";
    ErrorCode[ErrorCode["UNABLE_TO_CANCEL_ORDER"] = 134] = "UNABLE_TO_CANCEL_ORDER";
    ErrorCode[ErrorCode["UNABLE_TO_AMEND_ORDER"] = 135] = "UNABLE_TO_AMEND_ORDER";
    ErrorCode[ErrorCode["SHORT_SELLING_NOT_ALLOWED"] = 136] = "SHORT_SELLING_NOT_ALLOWED";
})(ErrorCode || (ErrorCode = {}));
var CommonErrorCode;
(function (CommonErrorCode) {
    CommonErrorCode[CommonErrorCode["UNKNOWN_ERROR"] = 1] = "UNKNOWN_ERROR";
    CommonErrorCode[CommonErrorCode["UNSUPPORTED_MESSAGE"] = 2] = "UNSUPPORTED_MESSAGE";
    CommonErrorCode[CommonErrorCode["INVALID_REQUEST"] = 3] = "INVALID_REQUEST";
    CommonErrorCode[CommonErrorCode["TIMEOUT_ERROR"] = 5] = "TIMEOUT_ERROR";
    CommonErrorCode[CommonErrorCode["ENTITY_NOT_FOUND"] = 6] = "ENTITY_NOT_FOUND";
    CommonErrorCode[CommonErrorCode["CANT_ROUTE_REQUEST"] = 7] = "CANT_ROUTE_REQUEST";
    CommonErrorCode[CommonErrorCode["FRAME_TOO_LONG"] = 8] = "FRAME_TOO_LONG";
    CommonErrorCode[CommonErrorCode["MARKET_CLOSED"] = 9] = "MARKET_CLOSED";
    CommonErrorCode[CommonErrorCode["CONCURRENT_MODIFICATION"] = 10] = "CONCURRENT_MODIFICATION";
    CommonErrorCode[CommonErrorCode["BLOCKED_PAYLOAD_TYPE"] = 11] = "BLOCKED_PAYLOAD_TYPE";
})(CommonErrorCode || (CommonErrorCode = {}));
//
// event callback
//
var CallbackType;
(function (CallbackType) {
    CallbackType["appDisconnect"] = "appDisconnect";
    CallbackType["accountDisconnect"] = "accountDisconnect";
    CallbackType["tokenInvalid"] = "tokenInvalid";
    CallbackType["account"] = "account";
    CallbackType["margin"] = "margin";
    CallbackType["symbol"] = "symbol";
    CallbackType["price"] = "price";
    CallbackType["depth"] = "depth";
    CallbackType["order"] = "order";
    CallbackType["unhandled"] = "unhandled";
})(CallbackType || (CallbackType = {}));
export { AccessRights, AccountType, CallbackType, ChangeBalanceType, ChangeBonusType, ClientPermissionScope, CommissionType, CommonErrorCode, DayOfWeek, DealStatus, ErrorCode, ExecutionType, LimitedRiskMarginCalculationStrategy, MinCommissionType, NotificationType, OrderStatus, OrderTriggerMethod, OrderType, PayloadType, PositionStatus, QuoteType, SwapCalculationType, SymbolDistanceType, TimeInForce, TotalMarginCalculationType, TradeSide, TradingMode, TrendbarPeriod, };
