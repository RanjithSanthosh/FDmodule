import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'intToDate',
    standalone: true
})
export class IntToDatePipe implements PipeTransform {

    transform(value: number | undefined | null): string {
        if (!value) return '';

        const argDate = value.toString();
        if (argDate.length !== 8) return ''; // Simple validation for YYYYMMDD

        const year = argDate.substring(0, 4);
        const month = argDate.substring(4, 6);
        const day = argDate.substring(6, 8);

        // Create date string valid for Date constructor (YYYY-MM-DD or similar)
        // The image uses new Date(year + "/" + month + "/" + day).toDateString() which returns "Wed Jan 14 2026"
        // However, input[type="date"] expects "YYYY-MM-DD".
        // Let's see what the image actually does.
        // Image says: return new Date(newDate).toDateString();
        // But the HTML says: | intToDate | date:'yyyy-MM-dd'
        // This implies intToDate returns a Date object or a string that the date pipe can handle.
        // .toDateString() returns a string like "Wed Jul 28 1993". The date pipe can parse this.
        // So I will return a valid Date object or string. returning a Date object is safer for the date pipe.

        const newDate = `${year}-${month}-${day}`;
        return new Date(newDate).toISOString(); // Date pipe handles ISO strings well
    }
}
