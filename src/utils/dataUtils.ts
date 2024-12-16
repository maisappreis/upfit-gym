import { type Revenue } from "@/types/revenue";
import { type Expense } from "@/types/expense";
import { type Customer } from "@/types/customer";

export function useDataUtils() {

  const searchData = (data: (Revenue | Expense | Customer)[], searchedField: string[]) => {
    const orderedData = orderData(data);

    if (searchedField && searchedField.length > 0) {
      return orderedData.reduce((searchedData, item) => {
        const matched = searchedField.some((element) => {
          const searchedFieldName = element.toLowerCase();
          const listedFieldName = item.name.toLowerCase();
  
          return listedFieldName.includes(searchedFieldName);
        })
        if (matched) {
          searchedData.push(item);
        }
        return searchedData;
      }, []);
    } else {
      return orderedData;
    }
  };

  const orderData = (data: (Revenue | Expense | Customer)[]): (Revenue | Expense | Customer)[] => {
    if (data && data.length > 0) {
      return data.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
    
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      return [];
    }
  };

  return {
    searchData
  };
};