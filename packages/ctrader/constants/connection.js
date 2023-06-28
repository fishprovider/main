var State;
(function (State) {
    State[State["NEW"] = 0] = "NEW";
    State[State["CONNECTED"] = 1] = "CONNECTED";
    State[State["STARTED"] = 2] = "STARTED";
    State[State["ERROR"] = 3] = "ERROR";
    State[State["CLOSED"] = 4] = "CLOSED";
})(State || (State = {}));
export { State, };
