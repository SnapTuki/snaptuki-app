
import { create } from 'zustand';
import Cookies from 'js-cookie';
import type {User} from  '../../lib/graphql/generated';
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Check for existing token on initial load
const initialToken = Cookies.get('_snaptuki_auth') || null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null, 
  token: initialToken,
  isAuthenticated: !!initialToken,

  login: (user, token) => {
    // 1. Save token securely in a cookie (Expires in 7 days, requires HTTPS in prod)
    console.log('User', user);
    Cookies.set('_snaptuki_auth', token, { 
      expires: 7, 
      secure: window.location.protocol === 'https:',
      sameSite: 'strict' 
    });
    
    // 2. Update React State
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    // 1. Remove the cookie
    Cookies.remove('_snaptuki_auth');
    
    // 2. Clear React State
    set({ user: null, token: null, isAuthenticated: false });
  },
}));