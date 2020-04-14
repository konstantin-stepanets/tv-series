export interface IEpisode {
  id: number;
  name: string;
  season: number;
  network: string[];
  released: string;
  genres: string[];
}

export interface SortDirection {
  name: string;
  released: string;
}
