import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY);
  }
}
