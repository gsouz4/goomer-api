type Restaurant = {
  id: string;
  name: string;
  address: {
    street: string;
    number: number;
    zip: string;
    city: string;
  };
};

export interface OutputListRestaurantsDTO {
  restaurants: Restaurant[];
}
