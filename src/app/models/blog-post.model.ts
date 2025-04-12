export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  category: 'human' | 'vet';
  createdAt: Date;
  imageUrl?: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: Date;
}
