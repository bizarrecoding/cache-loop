type User = {
  id: number;
  name: string;
  avatar: {
    large: string;
    medium: string;
  }
}

type PageInfo = {
  currentPage: number;
  hasNextPage: boolean;
  lastPage: number;
}

type Studio = {
  id: string;
  name: string;
  siteUrl: string;
}
 
type Title = {
  romaji: string;
  native: string;
  english: string;
}
type AiringSchedule = {
  id: number
  episode: number;
  airingAt: number; 
  timeUntilAiring: number
}

type AiringMedia = AiringSchedule & {
  media: Media;
} 
type DateLike = string | Date; 

type Season = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
type Format = "TV"|"MOVIE"|"OVA"|"ONA"|"TV_SHORT";
type Status = 'CURRENT' | 'COMPLETED' | 'PLANNING' | 'DROPPED' | 'PAUSED' | 'REPEATING';
type MediaStatus = 'NOT_YET_AIRED' | 'RELEASING' | 'FINISHED' | 'NOT_YET_RELEASED' | 'CANCELLED';

type MediaSort = "POPULARITY_DESC" | "SCORE" | "TITLE_ROMAJI" | "FORMAT";

type CoverImage = {
  extraLarge: string;
  large: string;
  color: string;
}

type RelationEdge = {
  id: string;
  relationType: string;
  node: {
    id: string;
    title: Title;
    siteUrl: string;
    format: Format;
    status: MediaStatus;
    episodes: number;
    coverImage: CoverImage;
    season: Season;
  }
}

type CharacterInfo = {
  id:string;
  role: string;
  voiceActors: {
    id: number;
    name:{
      full: string;
    }
    image: {
      medium: string;
    }
  }[];
  node: {
    name: {
      full: string;
      alternative: string[];
    }
    image: {
      medium: string;
    }
  }
  media?: Media[];
}

type CharacterConnection = {
  pageInfo: PageInfo
  edges: CharacterInfo[]
}

type Media = {
  id: number;
  idMal: string;
  title: Title;
  startDate: FuzzyDate;
  endDate: FuzzyDate
  status: MediaStatus;
  season: string;
  format: Format;
  genres: string[];
  synonyms: string;
  duration: string;
  popularity: string;
  episodes: number;
  chapters: number;
  source: any; //(version: 2)
  countryOfOrigin: string;
  hashtag: string;
  averageScore: number;
  siteUrl: string;
  description?: string;
  bannerImage: string;
  isAdult: boolean;
  coverImage: CoverImage;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  }
  externalLinks: {
    site: string;
    icon: string;
    color: string;
    url: string;
  }[]
  rankings: {
    rank: string;
    type: string;
    season: string;
    allTime: string;
  }[]
  studios: {
    nodes: Studio[];
  }
  relations: {
    edges:RelationEdge[]
  }
  airingSchedule: { //( notYetAired: true perPage: 2 ) {
    nodes: AiringSchedule[]
  }
  nextAiringEpisode:AiringSchedule
  mediaListEntry: Omit<MediaAnimeList,"media"> | null
  characters:CharacterConnection
}

type MediaAnimeList = {
  id: number;
  progress: number;
  status: Status;
  media: Media;
}

// SectionList<TData> -  SectionList format in watchlist screen
type MediaCategory = {
  id: string;
  data: MediaAnimeList[]
}

type FuzzyDate = {
  day: number;
  month: number;
  year: number;
}; 

//#region Queries and Mutations

type EntryInput = {
  id?: number|null;
  mediaId: number;
  status?: Status;
  progress?: number;
}

//#endregion