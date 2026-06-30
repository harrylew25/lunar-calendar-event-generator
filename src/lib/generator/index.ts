import { Lunar } from 'lunar-javascript';


const getLunarDate = (date: Date): string => {
    return Lunar.fromDate(date).toString();

};

export { getLunarDate };