export interface TimePeriodMeta {
    name: string;
    durationTime: Number;
}

export const Second: TimePeriodMeta = {
    name: 'second',
    durationTime: 1000,
};

export const Minute: TimePeriodMeta = {
    name: 'minute',
    durationTime: 1000 * 60,
};

export const Hour: TimePeriodMeta = {
    name: 'hour',
    durationTime: 1000 * 60 * 60,
};

export const Day: TimePeriodMeta = {
    name: 'day',
    durationTime: 1000 * 60 * 60 * 24,
};

export const Periods = [Second, Minute, Hour, Day];
