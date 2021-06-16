import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

  transform(items: Array<any>, searchText: string): any {
    if (searchText) {
        return items.filter(item => {
            const filter = Object.keys(item);
            return filter.some(key => item[key].toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        });
    }
    return items;
}

}
