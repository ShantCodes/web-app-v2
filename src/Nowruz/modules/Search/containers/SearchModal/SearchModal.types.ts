export interface SearchModalProps {
  onClose: () => void;
  open: boolean;
}
export interface Item {
  title: string;
  username: string;
  image: string;
  isAvailable: boolean;
  id: string;
  type: string;
  bio: string;
  isVerified: boolean;
}
