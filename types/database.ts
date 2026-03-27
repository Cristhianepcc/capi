export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      institutions: {
        Row: {
          id: string;
          name: string;
          type: "colegio" | "universidad" | "centro_comunitario" | "ong" | "centro_educativo";
          city: string;
          contact: string;
          email: string;
          status: "activo" | "inactivo" | "solicitud";
          contact_user_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          type: "colegio" | "universidad" | "centro_comunitario" | "ong" | "centro_educativo";
          city: string;
          contact: string;
          email: string;
          status?: "activo" | "inactivo" | "solicitud";
          contact_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "colegio" | "universidad" | "centro_comunitario" | "ong" | "centro_educativo";
          city?: string;
          contact?: string;
          email?: string;
          status?: "activo" | "inactivo" | "solicitud";
          contact_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      communities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          website: string | null;
          instagram: string | null;
          twitter: string | null;
          linkedin: string | null;
          github: string | null;
          discord: string | null;
          status: "activo" | "inactivo" | "solicitud";
          created_by: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          instagram?: string | null;
          twitter?: string | null;
          linkedin?: string | null;
          github?: string | null;
          discord?: string | null;
          status?: "activo" | "inactivo" | "solicitud";
          created_by: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          instagram?: string | null;
          twitter?: string | null;
          linkedin?: string | null;
          github?: string | null;
          discord?: string | null;
          status?: "activo" | "inactivo" | "solicitud";
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "communities_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          community_role_id: string;
          invited_by: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          community_role_id: string;
          invited_by?: string | null;
          joined_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          user_id?: string;
          community_role_id?: string;
          invited_by?: string | null;
          joined_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_members_community_role_id_fkey";
            columns: ["community_role_id"];
            isOneToOne: false;
            referencedRelation: "community_roles";
            referencedColumns: ["id"];
          }
        ];
      };
      community_permissions: {
        Row: {
          key: string;
          label: string;
          description: string | null;
        };
        Insert: {
          key: string;
          label: string;
          description?: string | null;
        };
        Update: {
          key?: string;
          label?: string;
          description?: string | null;
        };
        Relationships: [];
      };
      community_roles: {
        Row: {
          id: string;
          community_id: string;
          name: string;
          description: string | null;
          is_owner: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          name: string;
          description?: string | null;
          is_owner?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          name?: string;
          description?: string | null;
          is_owner?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_roles_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          }
        ];
      };
      community_role_permissions: {
        Row: {
          role_id: string;
          permission_key: string;
        };
        Insert: {
          role_id: string;
          permission_key: string;
        };
        Update: {
          role_id?: string;
          permission_key?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_role_permissions_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "community_roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_role_permissions_permission_key_fkey";
            columns: ["permission_key"];
            isOneToOne: false;
            referencedRelation: "community_permissions";
            referencedColumns: ["key"];
          }
        ];
      };
      events: {
        Row: {
          id: string;
          institution_id: string;
          community_id: string | null;
          title: string;
          slug: string;
          description: string;
          about: string | null;
          date: string;
          location: string;
          full_location: string | null;
          type: "taller" | "conferencia" | "charla" | "programa" | "evento_stem" | "voluntariado_educativo";
          status: "activo" | "borrador" | "finalizado";
          image_url: string | null;
          volunteers_needed: number;
          students_goal: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          institution_id: string;
          community_id?: string | null;
          title: string;
          slug: string;
          description: string;
          about?: string | null;
          date: string;
          location: string;
          full_location?: string | null;
          type: "taller" | "conferencia" | "charla" | "programa" | "evento_stem" | "voluntariado_educativo";
          status?: "activo" | "borrador" | "finalizado";
          image_url?: string | null;
          volunteers_needed?: number;
          students_goal?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          institution_id?: string;
          community_id?: string | null;
          title?: string;
          slug?: string;
          description?: string;
          about?: string | null;
          date?: string;
          location?: string;
          full_location?: string | null;
          type?: "taller" | "conferencia" | "charla" | "programa" | "evento_stem" | "voluntariado_educativo";
          status?: "activo" | "borrador" | "finalizado";
          image_url?: string | null;
          volunteers_needed?: number;
          students_goal?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          }
        ];
      };
      agenda_items: {
        Row: {
          id: string;
          event_id: string;
          time: string;
          title: string;
          description: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          event_id: string;
          time: string;
          title: string;
          description?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          event_id?: string;
          time?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "agenda_items_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
      event_roles: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          slots: number;
          sort_order: number;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          slots?: number;
          sort_order?: number;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          slots?: number;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "event_roles_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      event_sponsors: {
        Row: {
          event_id: string;
          sponsor_id: string;
        };
        Insert: {
          event_id: string;
          sponsor_id: string;
        };
        Update: {
          event_id?: string;
          sponsor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_sponsors_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_sponsors_sponsor_id_fkey";
            columns: ["sponsor_id"];
            isOneToOne: false;
            referencedRelation: "sponsors";
            referencedColumns: ["id"];
          }
        ];
      };
      volunteers: {
        Row: {
          id: string;
          name: string;
          email: string;
          user_id: string | null;
          avatar_color: string;
          avatar_hex: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          user_id?: string | null;
          avatar_color?: string;
          avatar_hex?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          user_id?: string | null;
          avatar_color?: string;
          avatar_hex?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "volunteers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      event_volunteers: {
        Row: {
          id: string;
          event_id: string;
          volunteer_id: string;
          role: string;
          status: "pendiente" | "aprobado" | "rechazado";
          hours: number;
          joined_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          volunteer_id: string;
          role: string;
          status?: "pendiente" | "aprobado" | "rechazado";
          hours?: number;
          joined_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          volunteer_id?: string;
          role?: string;
          status?: "pendiente" | "aprobado" | "rechazado";
          hours?: number;
          joined_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_volunteers_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_volunteers_volunteer_id_fkey";
            columns: ["volunteer_id"];
            isOneToOne: false;
            referencedRelation: "volunteers";
            referencedColumns: ["id"];
          }
        ];
      };
      user_profiles: {
        Row: {
          id: string;
          role: "admin" | "user";
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: "admin" | "user";
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: "admin" | "user";
          full_name?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      reviews: {
        Row: {
          id: string;
          event_id: string;
          author_id: string | null;
          author_type: "voluntario" | "institucion";
          volunteer_author_id: string | null;
          institution_author_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          author_id?: string | null;
          author_type: "voluntario" | "institucion";
          volunteer_author_id?: string | null;
          institution_author_id?: string | null;
          rating: number;
          comment?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          author_id?: string | null;
          author_type?: "voluntario" | "institucion";
          volunteer_author_id?: string | null;
          institution_author_id?: string | null;
          rating?: number;
          comment?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      find_user_id_by_email: {
        Args: { lookup_email: string };
        Returns: string;
      };
      has_permission: {
        Args: {
          check_user_id: string;
          check_community_id: string;
          permission: string;
        };
        Returns: boolean;
      };
      get_user_permissions: {
        Args: {
          check_user_id: string;
          check_community_id: string;
        };
        Returns: string[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Tipos de conveniencia
export type Institution = Database["public"]["Tables"]["institutions"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Community = Database["public"]["Tables"]["communities"]["Row"];
export type CommunityMember = Database["public"]["Tables"]["community_members"]["Row"];
export type CommunityPermission = Database["public"]["Tables"]["community_permissions"]["Row"];
export type CommunityRole = Database["public"]["Tables"]["community_roles"]["Row"];
export type CommunityRolePermission = Database["public"]["Tables"]["community_role_permissions"]["Row"];
export type AgendaItem = Database["public"]["Tables"]["agenda_items"]["Row"];
export type EventRoleRow = Database["public"]["Tables"]["event_roles"]["Row"];
export type Sponsor = Database["public"]["Tables"]["sponsors"]["Row"];
export type Volunteer = Database["public"]["Tables"]["volunteers"]["Row"];
export type EventVolunteer = Database["public"]["Tables"]["event_volunteers"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
