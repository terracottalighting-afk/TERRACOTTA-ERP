export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_security_event: {
        Row: {
          actor_user_id: string | null
          event_payload_json: Json
          event_type: Database["public"]["Enums"]["admin_security_event_type"]
          id: string
          impersonation_session_id: string | null
          ip_address: unknown
          occurred_at: string
          permission_id: string | null
          role_id: string | null
          system_setting_id: string | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_user_id?: string | null
          event_payload_json?: Json
          event_type: Database["public"]["Enums"]["admin_security_event_type"]
          id?: string
          impersonation_session_id?: string | null
          ip_address?: unknown
          occurred_at?: string
          permission_id?: string | null
          role_id?: string | null
          system_setting_id?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_user_id?: string | null
          event_payload_json?: Json
          event_type?: Database["public"]["Enums"]["admin_security_event_type"]
          id?: string
          impersonation_session_id?: string | null
          ip_address?: unknown
          occurred_at?: string
          permission_id?: string | null
          role_id?: string | null
          system_setting_id?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_security_event_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_security_event_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "admin_security_event_impersonation_session_id_fkey"
            columns: ["impersonation_session_id"]
            isOneToOne: false
            referencedRelation: "active_impersonation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_security_event_impersonation_session_id_fkey"
            columns: ["impersonation_session_id"]
            isOneToOne: false
            referencedRelation: "user_impersonation_session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_security_event_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_security_event_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_security_event_system_setting_id_fkey"
            columns: ["system_setting_id"]
            isOneToOne: false
            referencedRelation: "system_setting"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_security_event_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_security_event_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ar_adjustment: {
        Row: {
          adjustment_date: string
          adjustment_number: string
          adjustment_type: Database["public"]["Enums"]["ar_adjustment_type"]
          amount: number
          approved_by_user_id: string | null
          brand_id: string
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string
          customer_invoice_id: string
          customer_payment_application_id: string | null
          id: string
          notes: string | null
          reason_code: string
          reversed_adjustment_id: string | null
          reversed_at: string | null
          reversed_by_user_id: string | null
          status: Database["public"]["Enums"]["ar_adjustment_status"]
          updated_at: string
        }
        Insert: {
          adjustment_date?: string
          adjustment_number: string
          adjustment_type: Database["public"]["Enums"]["ar_adjustment_type"]
          amount: number
          approved_by_user_id?: string | null
          brand_id: string
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id: string
          customer_invoice_id: string
          customer_payment_application_id?: string | null
          id?: string
          notes?: string | null
          reason_code: string
          reversed_adjustment_id?: string | null
          reversed_at?: string | null
          reversed_by_user_id?: string | null
          status?: Database["public"]["Enums"]["ar_adjustment_status"]
          updated_at?: string
        }
        Update: {
          adjustment_date?: string
          adjustment_number?: string
          adjustment_type?: Database["public"]["Enums"]["ar_adjustment_type"]
          amount?: number
          approved_by_user_id?: string | null
          brand_id?: string
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string
          customer_invoice_id?: string
          customer_payment_application_id?: string | null
          id?: string
          notes?: string | null
          reason_code?: string
          reversed_adjustment_id?: string | null
          reversed_at?: string | null
          reversed_by_user_id?: string | null
          status?: Database["public"]["Enums"]["ar_adjustment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ar_adjustment_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ar_adjustment_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ar_adjustment_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ar_adjustment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ar_adjustment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ar_adjustment_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ar_adjustment_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ar_adjustment_customer_payment_application_id_fkey"
            columns: ["customer_payment_application_id"]
            isOneToOne: false
            referencedRelation: "customer_payment_application"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ar_adjustment_reversed_adjustment_id_fkey"
            columns: ["reversed_adjustment_id"]
            isOneToOne: false
            referencedRelation: "ar_adjustment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ar_adjustment_reversed_by_user_id_fkey"
            columns: ["reversed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ar_adjustment_reversed_by_user_id_fkey"
            columns: ["reversed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      attachment: {
        Row: {
          category: string | null
          content_type: string | null
          entity_id: string | null
          entity_type: string | null
          file_size: number | null
          id: string
          is_active: boolean
          original_file_name: string
          storage_bucket: string
          storage_path: string
          uploaded_at: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          category?: string | null
          content_type?: string | null
          entity_id?: string | null
          entity_type?: string | null
          file_size?: number | null
          id?: string
          is_active?: boolean
          original_file_name: string
          storage_bucket: string
          storage_path: string
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          category?: string | null
          content_type?: string | null
          entity_id?: string | null
          entity_type?: string | null
          file_size?: number | null
          id?: string
          is_active?: boolean
          original_file_name?: string
          storage_bucket?: string
          storage_path?: string
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachment_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachment_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          changed_at: string
          changed_by_user_id: string | null
          entity_id: string | null
          entity_type: string
          id: string
          impersonated_user_id: string | null
          impersonation_session_id: string | null
          ip_address: unknown
          new_values_json: Json | null
          old_values_json: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by_user_id?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          impersonated_user_id?: string | null
          impersonation_session_id?: string | null
          ip_address?: unknown
          new_values_json?: Json | null
          old_values_json?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by_user_id?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          impersonated_user_id?: string | null
          impersonation_session_id?: string | null
          ip_address?: unknown
          new_values_json?: Json | null
          old_values_json?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_changed_by_user_id_fkey"
            columns: ["changed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_changed_by_user_id_fkey"
            columns: ["changed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_log_impersonated_user_id_fkey"
            columns: ["impersonated_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_impersonated_user_id_fkey"
            columns: ["impersonated_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_log_impersonation_session_id_fkey"
            columns: ["impersonation_session_id"]
            isOneToOne: false
            referencedRelation: "active_impersonation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_impersonation_session_id_fkey"
            columns: ["impersonation_session_id"]
            isOneToOne: false
            referencedRelation: "user_impersonation_session"
            referencedColumns: ["id"]
          },
        ]
      }
      brand: {
        Row: {
          brand_code: string
          created_at: string
          id: string
          is_active: boolean
          legal_company_name: string | null
          name: string
          updated_at: string
        }
        Insert: {
          brand_code: string
          created_at?: string
          id?: string
          is_active?: boolean
          legal_company_name?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          brand_code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          legal_company_name?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      commission_ar_offset: {
        Row: {
          amount_applied: number
          applied_by_user_id: string | null
          applied_date: string
          ar_adjustment_id: string | null
          commission_payment_id: string
          created_at: string
          customer_account_id: string
          customer_invoice_id: string
          id: string
          notes: string | null
          posted_at: string | null
          sales_rep_agency_id: string
        }
        Insert: {
          amount_applied: number
          applied_by_user_id?: string | null
          applied_date?: string
          ar_adjustment_id?: string | null
          commission_payment_id: string
          created_at?: string
          customer_account_id: string
          customer_invoice_id: string
          id?: string
          notes?: string | null
          posted_at?: string | null
          sales_rep_agency_id: string
        }
        Update: {
          amount_applied?: number
          applied_by_user_id?: string | null
          applied_date?: string
          ar_adjustment_id?: string | null
          commission_payment_id?: string
          created_at?: string
          customer_account_id?: string
          customer_invoice_id?: string
          id?: string
          notes?: string | null
          posted_at?: string | null
          sales_rep_agency_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_ar_offset_applied_by_user_id_fkey"
            columns: ["applied_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_ar_offset_applied_by_user_id_fkey"
            columns: ["applied_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "commission_ar_offset_ar_adjustment_id_fkey"
            columns: ["ar_adjustment_id"]
            isOneToOne: false
            referencedRelation: "ar_adjustment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_ar_offset_commission_payment_id_fkey"
            columns: ["commission_payment_id"]
            isOneToOne: false
            referencedRelation: "commission_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_ar_offset_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_ar_offset_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_ar_offset_sales_rep_agency_id_fkey"
            columns: ["sales_rep_agency_id"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_payment: {
        Row: {
          ar_offset_amount: number
          cash_paid_amount: number
          commission_payment_number: string
          created_at: string
          created_by_user_id: string | null
          id: string
          notes: string | null
          payment_amount: number
          payment_date: string
          payment_reference: string | null
          payment_type: Database["public"]["Enums"]["commission_payment_type"]
          posted_at: string | null
          posted_by_user_id: string | null
          sales_rep_agency_id: string
          status: Database["public"]["Enums"]["commission_payment_status"]
          total_amount: number | null
          updated_at: string
          updated_by_user_id: string | null
          void_reason: string | null
          voided_at: string | null
          voided_by_user_id: string | null
        }
        Insert: {
          ar_offset_amount?: number
          cash_paid_amount?: number
          commission_payment_number?: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          notes?: string | null
          payment_amount?: number
          payment_date?: string
          payment_reference?: string | null
          payment_type?: Database["public"]["Enums"]["commission_payment_type"]
          posted_at?: string | null
          posted_by_user_id?: string | null
          sales_rep_agency_id: string
          status?: Database["public"]["Enums"]["commission_payment_status"]
          total_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
        }
        Update: {
          ar_offset_amount?: number
          cash_paid_amount?: number
          commission_payment_number?: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          notes?: string | null
          payment_amount?: number
          payment_date?: string
          payment_reference?: string | null
          payment_type?: Database["public"]["Enums"]["commission_payment_type"]
          posted_at?: string | null
          posted_by_user_id?: string | null
          sales_rep_agency_id?: string
          status?: Database["public"]["Enums"]["commission_payment_status"]
          total_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_payment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "commission_payment_posted_by_user_id_fkey"
            columns: ["posted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payment_posted_by_user_id_fkey"
            columns: ["posted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "commission_payment_sales_rep_agency_id_fkey"
            columns: ["sales_rep_agency_id"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "commission_payment_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payment_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      commission_payment_line: {
        Row: {
          amount_paid: number
          commission_payment_id: string
          commission_snapshot_id: string
          created_at: string
          id: string
          notes: string | null
        }
        Insert: {
          amount_paid: number
          commission_payment_id: string
          commission_snapshot_id: string
          created_at?: string
          id?: string
          notes?: string | null
        }
        Update: {
          amount_paid?: number
          commission_payment_id?: string
          commission_snapshot_id?: string
          created_at?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_payment_line_commission_payment_id_fkey"
            columns: ["commission_payment_id"]
            isOneToOne: false
            referencedRelation: "commission_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payment_line_commission_snapshot_id_fkey"
            columns: ["commission_snapshot_id"]
            isOneToOne: false
            referencedRelation: "commission_ready_report"
            referencedColumns: ["commission_snapshot_id"]
          },
          {
            foreignKeyName: "commission_payment_line_commission_snapshot_id_fkey"
            columns: ["commission_snapshot_id"]
            isOneToOne: false
            referencedRelation: "commission_snapshot"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_snapshot: {
        Row: {
          commission_amount: number | null
          commission_base_amount: number
          commission_percent: number
          commission_status: Database["public"]["Enums"]["commission_snapshot_status"]
          created_at: string
          created_by_user_id: string | null
          customer_invoice_id: string
          customer_invoice_line_id: string | null
          id: string
          ownership_rule: Database["public"]["Enums"]["commission_ownership_rule"]
          paid_amount: number
          sales_order_id: string
          sales_order_line_id: string | null
          sales_rep_agency_id: string
          sales_rep_id: string | null
          snapshot_date: string
          territory_id: string | null
          updated_at: string
          updated_by_user_id: string | null
          void_reason: string | null
          voided_at: string | null
          voided_by_user_id: string | null
        }
        Insert: {
          commission_amount?: number | null
          commission_base_amount?: number
          commission_percent?: number
          commission_status?: Database["public"]["Enums"]["commission_snapshot_status"]
          created_at?: string
          created_by_user_id?: string | null
          customer_invoice_id: string
          customer_invoice_line_id?: string | null
          id?: string
          ownership_rule?: Database["public"]["Enums"]["commission_ownership_rule"]
          paid_amount?: number
          sales_order_id: string
          sales_order_line_id?: string | null
          sales_rep_agency_id: string
          sales_rep_id?: string | null
          snapshot_date?: string
          territory_id?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
        }
        Update: {
          commission_amount?: number | null
          commission_base_amount?: number
          commission_percent?: number
          commission_status?: Database["public"]["Enums"]["commission_snapshot_status"]
          created_at?: string
          created_by_user_id?: string | null
          customer_invoice_id?: string
          customer_invoice_line_id?: string | null
          id?: string
          ownership_rule?: Database["public"]["Enums"]["commission_ownership_rule"]
          paid_amount?: number
          sales_order_id?: string
          sales_order_line_id?: string | null
          sales_rep_agency_id?: string
          sales_rep_id?: string | null
          snapshot_date?: string
          territory_id?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_snapshot_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "commission_snapshot_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_customer_invoice_line_id_fkey"
            columns: ["customer_invoice_line_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
          {
            foreignKeyName: "commission_snapshot_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "rga_available_sales_order_lines"
            referencedColumns: ["sales_order_line_id"]
          },
          {
            foreignKeyName: "commission_snapshot_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "sales_order_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_sales_rep_agency_id_fkey"
            columns: ["sales_rep_agency_id"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_sales_rep_id_fkey"
            columns: ["sales_rep_id"]
            isOneToOne: false
            referencedRelation: "sales_rep"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "commission_snapshot_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      container_document: {
        Row: {
          display_name: string | null
          document_type: string
          file_id: string
          id: string
          import_container_id: string
          is_active: boolean
          uploaded_at: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          display_name?: string | null
          document_type: string
          file_id: string
          id?: string
          import_container_id: string
          is_active?: boolean
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          display_name?: string | null
          document_type?: string
          file_id?: string
          id?: string
          import_container_id?: string
          is_active?: boolean
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "container_document_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "container_document_import_container_id_fkey"
            columns: ["import_container_id"]
            isOneToOne: false
            referencedRelation: "import_container"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "container_document_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "container_document_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      credit_memo: {
        Row: {
          additional_credit_amount: number
          amount_applied: number
          amount_remaining: number | null
          brand_id: string
          brand_name_snapshot: string
          created_at: string
          created_by_user_id: string | null
          credit_memo_number: string
          customer_account_id: string
          customer_account_number_snapshot: string | null
          customer_invoice_id: string | null
          customer_name_snapshot: string
          emailed_at: string | null
          id: string
          issue_date: string
          legacy_account_id_snapshot: string | null
          notes: string | null
          posted_at: string | null
          posted_by_user_id: string | null
          product_credit_amount: number
          reason_code: Database["public"]["Enums"]["credit_memo_reason_code"]
          restocking_fee_amount: number
          restocking_fee_percent: number
          rga_id: string | null
          shipping_refund_amount: number
          status: Database["public"]["Enums"]["credit_memo_status"]
          tax_credit_amount: number
          total_credit_amount: number | null
          updated_at: string
          updated_by_user_id: string | null
          void_reason: string | null
          voided_at: string | null
          voided_by_user_id: string | null
        }
        Insert: {
          additional_credit_amount?: number
          amount_applied?: number
          amount_remaining?: number | null
          brand_id: string
          brand_name_snapshot: string
          created_at?: string
          created_by_user_id?: string | null
          credit_memo_number: string
          customer_account_id: string
          customer_account_number_snapshot?: string | null
          customer_invoice_id?: string | null
          customer_name_snapshot: string
          emailed_at?: string | null
          id?: string
          issue_date?: string
          legacy_account_id_snapshot?: string | null
          notes?: string | null
          posted_at?: string | null
          posted_by_user_id?: string | null
          product_credit_amount?: number
          reason_code?: Database["public"]["Enums"]["credit_memo_reason_code"]
          restocking_fee_amount?: number
          restocking_fee_percent?: number
          rga_id?: string | null
          shipping_refund_amount?: number
          status?: Database["public"]["Enums"]["credit_memo_status"]
          tax_credit_amount?: number
          total_credit_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
        }
        Update: {
          additional_credit_amount?: number
          amount_applied?: number
          amount_remaining?: number | null
          brand_id?: string
          brand_name_snapshot?: string
          created_at?: string
          created_by_user_id?: string | null
          credit_memo_number?: string
          customer_account_id?: string
          customer_account_number_snapshot?: string | null
          customer_invoice_id?: string | null
          customer_name_snapshot?: string
          emailed_at?: string | null
          id?: string
          issue_date?: string
          legacy_account_id_snapshot?: string | null
          notes?: string | null
          posted_at?: string | null
          posted_by_user_id?: string | null
          product_credit_amount?: number
          reason_code?: Database["public"]["Enums"]["credit_memo_reason_code"]
          restocking_fee_amount?: number
          restocking_fee_percent?: number
          rga_id?: string | null
          shipping_refund_amount?: number
          status?: Database["public"]["Enums"]["credit_memo_status"]
          tax_credit_amount?: number
          total_credit_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_memo_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "credit_memo_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_posted_by_user_id_fkey"
            columns: ["posted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_posted_by_user_id_fkey"
            columns: ["posted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "credit_memo_rga_id_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_rga_id_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga_dashboard_action_queue"
            referencedColumns: ["rga_id"]
          },
          {
            foreignKeyName: "credit_memo_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "credit_memo_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      credit_memo_application: {
        Row: {
          amount_applied: number
          application_status: Database["public"]["Enums"]["payment_application_status"]
          applied_by_user_id: string | null
          applied_date: string
          created_at: string
          credit_memo_id: string
          customer_invoice_id: string
          customer_payment_application_id: string | null
          customer_payment_id: string | null
          id: string
          notes: string | null
          reversal_reason: string | null
          reversed_at: string | null
          reversed_by_user_id: string | null
          source_transaction_id: string | null
          source_transaction_type: Database["public"]["Enums"]["credit_memo_application_source_type"]
          updated_at: string
        }
        Insert: {
          amount_applied: number
          application_status?: Database["public"]["Enums"]["payment_application_status"]
          applied_by_user_id?: string | null
          applied_date?: string
          created_at?: string
          credit_memo_id: string
          customer_invoice_id: string
          customer_payment_application_id?: string | null
          customer_payment_id?: string | null
          id?: string
          notes?: string | null
          reversal_reason?: string | null
          reversed_at?: string | null
          reversed_by_user_id?: string | null
          source_transaction_id?: string | null
          source_transaction_type?: Database["public"]["Enums"]["credit_memo_application_source_type"]
          updated_at?: string
        }
        Update: {
          amount_applied?: number
          application_status?: Database["public"]["Enums"]["payment_application_status"]
          applied_by_user_id?: string | null
          applied_date?: string
          created_at?: string
          credit_memo_id?: string
          customer_invoice_id?: string
          customer_payment_application_id?: string | null
          customer_payment_id?: string | null
          id?: string
          notes?: string | null
          reversal_reason?: string | null
          reversed_at?: string | null
          reversed_by_user_id?: string | null
          source_transaction_id?: string | null
          source_transaction_type?: Database["public"]["Enums"]["credit_memo_application_source_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_memo_application_applied_by_user_id_fkey"
            columns: ["applied_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_application_applied_by_user_id_fkey"
            columns: ["applied_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "credit_memo_application_credit_memo_id_fkey"
            columns: ["credit_memo_id"]
            isOneToOne: false
            referencedRelation: "credit_memo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_application_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_application_customer_payment_application_id_fkey"
            columns: ["customer_payment_application_id"]
            isOneToOne: false
            referencedRelation: "customer_payment_application"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_application_customer_payment_id_fkey"
            columns: ["customer_payment_id"]
            isOneToOne: false
            referencedRelation: "customer_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_application_reversed_by_user_id_fkey"
            columns: ["reversed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_application_reversed_by_user_id_fkey"
            columns: ["reversed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      credit_memo_line: {
        Row: {
          created_at: string
          credit_memo_id: string
          customer_invoice_line_id: string | null
          description: string
          id: string
          line_total: number | null
          product_id: string | null
          quantity: number
          restocking_fee_amount: number
          rga_line_id: string | null
          unit_amount: number
        }
        Insert: {
          created_at?: string
          credit_memo_id: string
          customer_invoice_line_id?: string | null
          description: string
          id?: string
          line_total?: number | null
          product_id?: string | null
          quantity?: number
          restocking_fee_amount?: number
          rga_line_id?: string | null
          unit_amount: number
        }
        Update: {
          created_at?: string
          credit_memo_id?: string
          customer_invoice_line_id?: string | null
          description?: string
          id?: string
          line_total?: number | null
          product_id?: string | null
          quantity?: number
          restocking_fee_amount?: number
          rga_line_id?: string | null
          unit_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "credit_memo_line_credit_memo_id_fkey"
            columns: ["credit_memo_id"]
            isOneToOne: false
            referencedRelation: "credit_memo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_line_customer_invoice_line_id_fkey"
            columns: ["customer_invoice_line_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "credit_memo_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "credit_memo_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "credit_memo_line_rga_line_id_fkey"
            columns: ["rga_line_id"]
            isOneToOne: false
            referencedRelation: "rga_line"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_account: {
        Row: {
          account_number: string
          account_type_id: string
          billing_contact_name: string | null
          billing_email: string | null
          billing_phone: string | null
          business_type_id: string
          created_at: string
          created_by_user_id: string | null
          currency: string
          default_discount_percent: number
          id: string
          is_sales_tax_exempt: boolean
          legacy_account_id: string | null
          legal_name: string | null
          linked_sales_rep_agency_id: string | null
          main_email: string | null
          main_phone: string | null
          name: string
          notes: string | null
          purchase_contact_name: string | null
          purchase_email: string | null
          purchase_phone: string | null
          state_resale_certificate_number: string | null
          status: Database["public"]["Enums"]["customer_account_status"]
          tax_code: string | null
          updated_at: string
          updated_by_user_id: string | null
          website: string | null
        }
        Insert: {
          account_number?: string
          account_type_id: string
          billing_contact_name?: string | null
          billing_email?: string | null
          billing_phone?: string | null
          business_type_id: string
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          default_discount_percent?: number
          id?: string
          is_sales_tax_exempt?: boolean
          legacy_account_id?: string | null
          legal_name?: string | null
          linked_sales_rep_agency_id?: string | null
          main_email?: string | null
          main_phone?: string | null
          name: string
          notes?: string | null
          purchase_contact_name?: string | null
          purchase_email?: string | null
          purchase_phone?: string | null
          state_resale_certificate_number?: string | null
          status?: Database["public"]["Enums"]["customer_account_status"]
          tax_code?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          website?: string | null
        }
        Update: {
          account_number?: string
          account_type_id?: string
          billing_contact_name?: string | null
          billing_email?: string | null
          billing_phone?: string | null
          business_type_id?: string
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          default_discount_percent?: number
          id?: string
          is_sales_tax_exempt?: boolean
          legacy_account_id?: string | null
          legal_name?: string | null
          linked_sales_rep_agency_id?: string | null
          main_email?: string | null
          main_phone?: string | null
          name?: string
          notes?: string | null
          purchase_contact_name?: string | null
          purchase_email?: string | null
          purchase_phone?: string | null
          state_resale_certificate_number?: string | null
          status?: Database["public"]["Enums"]["customer_account_status"]
          tax_code?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_account_account_type_id_fkey"
            columns: ["account_type_id"]
            isOneToOne: false
            referencedRelation: "customer_account_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_account_business_type_id_fkey"
            columns: ["business_type_id"]
            isOneToOne: false
            referencedRelation: "customer_business_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_account_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_account_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_account_linked_sales_rep_agency_fkey"
            columns: ["linked_sales_rep_agency_id"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_account_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_account_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_account_type: {
        Row: {
          created_at: string
          default_credit_limit: number
          default_discount_percent: number
          description: string | null
          id: string
          is_active: boolean
          is_rep_type: boolean
          name: string
          sort_order: number
          type_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_credit_limit?: number
          default_discount_percent?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_rep_type?: boolean
          name: string
          sort_order?: number
          type_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_credit_limit?: number
          default_discount_percent?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_rep_type?: boolean
          name?: string
          sort_order?: number
          type_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_billing_profile: {
        Row: {
          billing_notes: string | null
          created_at: string
          created_by_user_id: string | null
          credit_limit: number | null
          credit_limit_source: Database["public"]["Enums"]["credit_limit_source"]
          customer_account_id: string
          default_statement_email: string | null
          id: string
          invoice_delivery_method: Database["public"]["Enums"]["delivery_method"]
          is_active: boolean
          payment_days: number
          payment_terms: string
          statement_delivery_method: Database["public"]["Enums"]["delivery_method"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          billing_notes?: string | null
          created_at?: string
          created_by_user_id?: string | null
          credit_limit?: number | null
          credit_limit_source?: Database["public"]["Enums"]["credit_limit_source"]
          customer_account_id: string
          default_statement_email?: string | null
          id?: string
          invoice_delivery_method?: Database["public"]["Enums"]["delivery_method"]
          is_active?: boolean
          payment_days?: number
          payment_terms?: string
          statement_delivery_method?: Database["public"]["Enums"]["delivery_method"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          billing_notes?: string | null
          created_at?: string
          created_by_user_id?: string | null
          credit_limit?: number | null
          credit_limit_source?: Database["public"]["Enums"]["credit_limit_source"]
          customer_account_id?: string
          default_statement_email?: string | null
          id?: string
          invoice_delivery_method?: Database["public"]["Enums"]["delivery_method"]
          is_active?: boolean
          payment_days?: number
          payment_terms?: string
          statement_delivery_method?: Database["public"]["Enums"]["delivery_method"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_billing_profile_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_billing_profile_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_billing_profile_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_billing_profile_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_billing_profile_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_business_type: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          type_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          type_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          type_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_contact: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string
          customer_location_id: string | null
          department: string | null
          email: string | null
          fax: string | null
          id: string
          is_active: boolean
          is_billing_contact: boolean
          is_primary: boolean
          is_purchasing_contact: boolean
          is_showroom_floor_sales: boolean
          is_showroom_manager: boolean
          is_warehouse_receiver: boolean
          mobile: string | null
          name: string
          phone: string | null
          title: string | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id: string
          customer_location_id?: string | null
          department?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          is_active?: boolean
          is_billing_contact?: boolean
          is_primary?: boolean
          is_purchasing_contact?: boolean
          is_showroom_floor_sales?: boolean
          is_showroom_manager?: boolean
          is_warehouse_receiver?: boolean
          mobile?: string | null
          name: string
          phone?: string | null
          title?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string
          customer_location_id?: string | null
          department?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          is_active?: boolean
          is_billing_contact?: boolean
          is_primary?: boolean
          is_purchasing_contact?: boolean
          is_showroom_floor_sales?: boolean
          is_showroom_manager?: boolean
          is_warehouse_receiver?: boolean
          mobile?: string | null
          name?: string
          phone?: string | null
          title?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_contact_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_contact_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_contact_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_contact_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_contact_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_contact_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_freight_policy: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string
          customer_location_id: string | null
          default_ground_carrier: string | null
          default_ground_carrier_account_number: string | null
          default_ltl_carrier: string | null
          default_ltl_carrier_account_number: string | null
          flat_rate_percent: number | null
          free_freight_threshold: number | null
          freight_allowance_amount: number | null
          freight_terms: Database["public"]["Enums"]["freight_terms"]
          ground_freight_terms: Database["public"]["Enums"]["freight_terms"]
          id: string
          is_active: boolean
          is_default: boolean
          ltl_freight_terms: Database["public"]["Enums"]["freight_terms"]
          policy_name: string
          preferred_shipping_type: string | null
          special_instructions: string | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id: string
          customer_location_id?: string | null
          default_ground_carrier?: string | null
          default_ground_carrier_account_number?: string | null
          default_ltl_carrier?: string | null
          default_ltl_carrier_account_number?: string | null
          flat_rate_percent?: number | null
          free_freight_threshold?: number | null
          freight_allowance_amount?: number | null
          freight_terms?: Database["public"]["Enums"]["freight_terms"]
          ground_freight_terms?: Database["public"]["Enums"]["freight_terms"]
          id?: string
          is_active?: boolean
          is_default?: boolean
          ltl_freight_terms?: Database["public"]["Enums"]["freight_terms"]
          policy_name: string
          preferred_shipping_type?: string | null
          special_instructions?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string
          customer_location_id?: string | null
          default_ground_carrier?: string | null
          default_ground_carrier_account_number?: string | null
          default_ltl_carrier?: string | null
          default_ltl_carrier_account_number?: string | null
          flat_rate_percent?: number | null
          free_freight_threshold?: number | null
          freight_allowance_amount?: number | null
          freight_terms?: Database["public"]["Enums"]["freight_terms"]
          ground_freight_terms?: Database["public"]["Enums"]["freight_terms"]
          id?: string
          is_active?: boolean
          is_default?: boolean
          ltl_freight_terms?: Database["public"]["Enums"]["freight_terms"]
          policy_name?: string
          preferred_shipping_type?: string | null
          special_instructions?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_freight_policy_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_freight_policy_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_freight_policy_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_freight_policy_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_freight_policy_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_freight_policy_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_invoice: {
        Row: {
          balance_due: number | null
          bill_to_snapshot_json: Json | null
          brand_id: string
          brand_logo_file_id_snapshot: string | null
          brand_name_snapshot: string
          commission_exclusion_reason: string | null
          commission_payable: boolean
          commission_status: Database["public"]["Enums"]["commission_status"]
          created_at: string
          created_by_user_id: string | null
          credit_applied_amount: number
          currency: string
          customer_account_id: string
          customer_account_number_snapshot: string | null
          customer_location_id: string | null
          customer_name_snapshot: string
          dropship_fee_amount: number
          due_date: string | null
          email_status: Database["public"]["Enums"]["invoice_email_status"]
          emailed_at: string | null
          freight_amount: number
          id: string
          invoice_date: string
          invoice_generation_mode: Database["public"]["Enums"]["customer_invoice_generation_mode"]
          invoice_number: string
          invoice_status: Database["public"]["Enums"]["customer_invoice_status"]
          invoice_template_id: string | null
          is_dropship: boolean
          legacy_account_id_snapshot: string | null
          packing_list_id: string
          payment_applied_amount: number
          payment_status: Database["public"]["Enums"]["customer_invoice_payment_status"]
          payment_terms_snapshot: string | null
          sales_order_id: string
          sales_rep_agency_id_snapshot: string | null
          sales_rep_id_snapshot: string | null
          ship_to_snapshot_json: Json
          ship_to_type: Database["public"]["Enums"]["sales_order_ship_to_type"]
          subtotal_amount: number
          tax_amount: number
          territory_id_snapshot: string | null
          total_amount: number | null
          updated_at: string
          updated_by_user_id: string | null
          void_reason: string | null
          voided_at: string | null
          voided_by_user_id: string | null
          waived_amount: number
        }
        Insert: {
          balance_due?: number | null
          bill_to_snapshot_json?: Json | null
          brand_id: string
          brand_logo_file_id_snapshot?: string | null
          brand_name_snapshot: string
          commission_exclusion_reason?: string | null
          commission_payable?: boolean
          commission_status?: Database["public"]["Enums"]["commission_status"]
          created_at?: string
          created_by_user_id?: string | null
          credit_applied_amount?: number
          currency?: string
          customer_account_id: string
          customer_account_number_snapshot?: string | null
          customer_location_id?: string | null
          customer_name_snapshot: string
          dropship_fee_amount?: number
          due_date?: string | null
          email_status?: Database["public"]["Enums"]["invoice_email_status"]
          emailed_at?: string | null
          freight_amount?: number
          id?: string
          invoice_date?: string
          invoice_generation_mode?: Database["public"]["Enums"]["customer_invoice_generation_mode"]
          invoice_number: string
          invoice_status?: Database["public"]["Enums"]["customer_invoice_status"]
          invoice_template_id?: string | null
          is_dropship?: boolean
          legacy_account_id_snapshot?: string | null
          packing_list_id: string
          payment_applied_amount?: number
          payment_status?: Database["public"]["Enums"]["customer_invoice_payment_status"]
          payment_terms_snapshot?: string | null
          sales_order_id: string
          sales_rep_agency_id_snapshot?: string | null
          sales_rep_id_snapshot?: string | null
          ship_to_snapshot_json: Json
          ship_to_type: Database["public"]["Enums"]["sales_order_ship_to_type"]
          subtotal_amount?: number
          tax_amount?: number
          territory_id_snapshot?: string | null
          total_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
          waived_amount?: number
        }
        Update: {
          balance_due?: number | null
          bill_to_snapshot_json?: Json | null
          brand_id?: string
          brand_logo_file_id_snapshot?: string | null
          brand_name_snapshot?: string
          commission_exclusion_reason?: string | null
          commission_payable?: boolean
          commission_status?: Database["public"]["Enums"]["commission_status"]
          created_at?: string
          created_by_user_id?: string | null
          credit_applied_amount?: number
          currency?: string
          customer_account_id?: string
          customer_account_number_snapshot?: string | null
          customer_location_id?: string | null
          customer_name_snapshot?: string
          dropship_fee_amount?: number
          due_date?: string | null
          email_status?: Database["public"]["Enums"]["invoice_email_status"]
          emailed_at?: string | null
          freight_amount?: number
          id?: string
          invoice_date?: string
          invoice_generation_mode?: Database["public"]["Enums"]["customer_invoice_generation_mode"]
          invoice_number?: string
          invoice_status?: Database["public"]["Enums"]["customer_invoice_status"]
          invoice_template_id?: string | null
          is_dropship?: boolean
          legacy_account_id_snapshot?: string | null
          packing_list_id?: string
          payment_applied_amount?: number
          payment_status?: Database["public"]["Enums"]["customer_invoice_payment_status"]
          payment_terms_snapshot?: string | null
          sales_order_id?: string
          sales_rep_agency_id_snapshot?: string | null
          sales_rep_id_snapshot?: string | null
          ship_to_snapshot_json?: Json
          ship_to_type?: Database["public"]["Enums"]["sales_order_ship_to_type"]
          subtotal_amount?: number
          tax_amount?: number
          territory_id_snapshot?: string | null
          total_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
          waived_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_invoice_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_brand_logo_file_id_snapshot_fkey"
            columns: ["brand_logo_file_id_snapshot"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_invoice_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_invoice_template_id_fkey"
            columns: ["invoice_template_id"]
            isOneToOne: false
            referencedRelation: "document_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_packing_list_id_fkey"
            columns: ["packing_list_id"]
            isOneToOne: false
            referencedRelation: "packing_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
          {
            foreignKeyName: "customer_invoice_sales_rep_agency_snapshot_fkey"
            columns: ["sales_rep_agency_id_snapshot"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_sales_rep_snapshot_fkey"
            columns: ["sales_rep_id_snapshot"]
            isOneToOne: false
            referencedRelation: "sales_rep"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_territory_snapshot_fkey"
            columns: ["territory_id_snapshot"]
            isOneToOne: false
            referencedRelation: "territory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_invoice_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_invoice_line: {
        Row: {
          brand_id_snapshot: string
          brand_name_snapshot: string
          created_at: string
          customer_invoice_id: string
          discount_percent: number
          id: string
          line_total: number | null
          packing_list_line_id: string
          product_id: string
          product_name_snapshot: string
          product_sku_snapshot: string
          quantity_invoiced: number
          sales_order_line_id: string
          unit_price: number
        }
        Insert: {
          brand_id_snapshot: string
          brand_name_snapshot: string
          created_at?: string
          customer_invoice_id: string
          discount_percent?: number
          id?: string
          line_total?: number | null
          packing_list_line_id: string
          product_id: string
          product_name_snapshot: string
          product_sku_snapshot: string
          quantity_invoiced: number
          sales_order_line_id: string
          unit_price: number
        }
        Update: {
          brand_id_snapshot?: string
          brand_name_snapshot?: string
          created_at?: string
          customer_invoice_id?: string
          discount_percent?: number
          id?: string
          line_total?: number | null
          packing_list_line_id?: string
          product_id?: string
          product_name_snapshot?: string
          product_sku_snapshot?: string
          quantity_invoiced?: number
          sales_order_line_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_invoice_line_brand_id_snapshot_fkey"
            columns: ["brand_id_snapshot"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_line_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_line_packing_list_line_id_fkey"
            columns: ["packing_list_line_id"]
            isOneToOne: false
            referencedRelation: "packing_list_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "customer_invoice_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "customer_invoice_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "customer_invoice_line_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "rga_available_sales_order_lines"
            referencedColumns: ["sales_order_line_id"]
          },
          {
            foreignKeyName: "customer_invoice_line_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "sales_order_line"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_location: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          country: string
          country_code: string
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string
          default_ship_to_order_channel: string | null
          email: string | null
          freight_policy_id: string | null
          id: string
          is_billing_address: boolean
          is_default_ship_to: boolean
          is_ecommerce_platform: boolean
          is_shipping_address: boolean
          is_showroom: boolean
          legacy_location_code: string | null
          location_code: string | null
          location_name: string
          location_type: Database["public"]["Enums"]["customer_location_type"]
          phone: string | null
          postal_code: string | null
          receiver_name: string | null
          shipping_instructions: string | null
          showroom_location_code: string | null
          state_province: string | null
          status: Database["public"]["Enums"]["customer_location_status"]
          territory_assignment_source: string
          territory_id: string | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string
          country_code?: string
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id: string
          default_ship_to_order_channel?: string | null
          email?: string | null
          freight_policy_id?: string | null
          id?: string
          is_billing_address?: boolean
          is_default_ship_to?: boolean
          is_ecommerce_platform?: boolean
          is_shipping_address?: boolean
          is_showroom?: boolean
          legacy_location_code?: string | null
          location_code?: string | null
          location_name: string
          location_type?: Database["public"]["Enums"]["customer_location_type"]
          phone?: string | null
          postal_code?: string | null
          receiver_name?: string | null
          shipping_instructions?: string | null
          showroom_location_code?: string | null
          state_province?: string | null
          status?: Database["public"]["Enums"]["customer_location_status"]
          territory_assignment_source?: string
          territory_id?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string
          country_code?: string
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string
          default_ship_to_order_channel?: string | null
          email?: string | null
          freight_policy_id?: string | null
          id?: string
          is_billing_address?: boolean
          is_default_ship_to?: boolean
          is_ecommerce_platform?: boolean
          is_shipping_address?: boolean
          is_showroom?: boolean
          legacy_location_code?: string | null
          location_code?: string | null
          location_name?: string
          location_type?: Database["public"]["Enums"]["customer_location_type"]
          phone?: string | null
          postal_code?: string | null
          receiver_name?: string | null
          shipping_instructions?: string | null
          showroom_location_code?: string | null
          state_province?: string | null
          status?: Database["public"]["Enums"]["customer_location_status"]
          territory_assignment_source?: string
          territory_id?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_location_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_location_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_freight_policy_fkey"
            columns: ["freight_policy_id"]
            isOneToOne: false
            referencedRelation: "customer_freight_policy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_territory_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_location_rep_assignment: {
        Row: {
          assignment_source: Database["public"]["Enums"]["rep_assignment_source"]
          coverage_role: Database["public"]["Enums"]["rep_coverage_role"]
          created_at: string
          created_by_user_id: string | null
          customer_location_id: string
          end_date: string | null
          id: string
          notes: string | null
          sales_rep_agency_id: string
          sales_rep_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["rep_assignment_status"]
          territory_id: string | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          assignment_source?: Database["public"]["Enums"]["rep_assignment_source"]
          coverage_role?: Database["public"]["Enums"]["rep_coverage_role"]
          created_at?: string
          created_by_user_id?: string | null
          customer_location_id: string
          end_date?: string | null
          id?: string
          notes?: string | null
          sales_rep_agency_id: string
          sales_rep_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["rep_assignment_status"]
          territory_id?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          assignment_source?: Database["public"]["Enums"]["rep_assignment_source"]
          coverage_role?: Database["public"]["Enums"]["rep_coverage_role"]
          created_at?: string
          created_by_user_id?: string | null
          customer_location_id?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          sales_rep_agency_id?: string
          sales_rep_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["rep_assignment_status"]
          territory_id?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_location_rep_assignment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_sales_rep_agency_id_fkey"
            columns: ["sales_rep_agency_id"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_sales_rep_id_fkey"
            columns: ["sales_rep_id"]
            isOneToOne: false
            referencedRelation: "sales_rep"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_payment: {
        Row: {
          amount_applied: number
          amount_received: number
          amount_unapplied: number | null
          brand_id: string
          created_at: string
          created_by_user_id: string | null
          currency: string
          customer_account_id: string
          deposit_account: string | null
          id: string
          memo: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["customer_payment_method"]
          payment_number: string
          posted_at: string | null
          posted_by_user_id: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["customer_payment_status"]
          updated_at: string
          updated_by_user_id: string | null
          void_reason: string | null
          voided_at: string | null
          voided_by_user_id: string | null
        }
        Insert: {
          amount_applied?: number
          amount_received: number
          amount_unapplied?: number | null
          brand_id: string
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          customer_account_id: string
          deposit_account?: string | null
          id?: string
          memo?: string | null
          payment_date?: string
          payment_method: Database["public"]["Enums"]["customer_payment_method"]
          payment_number: string
          posted_at?: string | null
          posted_by_user_id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["customer_payment_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
        }
        Update: {
          amount_applied?: number
          amount_received?: number
          amount_unapplied?: number | null
          brand_id?: string
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          customer_account_id?: string
          deposit_account?: string | null
          id?: string
          memo?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["customer_payment_method"]
          payment_number?: string
          posted_at?: string | null
          posted_by_user_id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["customer_payment_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          void_reason?: string | null
          voided_at?: string | null
          voided_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_payment_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_payment_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_posted_by_user_id_fkey"
            columns: ["posted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_posted_by_user_id_fkey"
            columns: ["posted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_payment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_payment_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_voided_by_user_id_fkey"
            columns: ["voided_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_payment_application: {
        Row: {
          amount_applied: number
          application_status: Database["public"]["Enums"]["payment_application_status"]
          applied_by_user_id: string | null
          applied_date: string
          created_at: string
          customer_invoice_id: string
          customer_payment_id: string
          id: string
          line_waive_amount: number
          notes: string | null
          reversal_of_application_id: string | null
          reversed_at: string | null
          reversed_by_user_id: string | null
        }
        Insert: {
          amount_applied?: number
          application_status?: Database["public"]["Enums"]["payment_application_status"]
          applied_by_user_id?: string | null
          applied_date?: string
          created_at?: string
          customer_invoice_id: string
          customer_payment_id: string
          id?: string
          line_waive_amount?: number
          notes?: string | null
          reversal_of_application_id?: string | null
          reversed_at?: string | null
          reversed_by_user_id?: string | null
        }
        Update: {
          amount_applied?: number
          application_status?: Database["public"]["Enums"]["payment_application_status"]
          applied_by_user_id?: string | null
          applied_date?: string
          created_at?: string
          customer_invoice_id?: string
          customer_payment_id?: string
          id?: string
          line_waive_amount?: number
          notes?: string | null
          reversal_of_application_id?: string | null
          reversed_at?: string | null
          reversed_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_payment_application_applied_by_user_id_fkey"
            columns: ["applied_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_application_applied_by_user_id_fkey"
            columns: ["applied_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_payment_application_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_application_customer_payment_id_fkey"
            columns: ["customer_payment_id"]
            isOneToOne: false
            referencedRelation: "customer_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_application_reversal_of_application_id_fkey"
            columns: ["reversal_of_application_id"]
            isOneToOne: false
            referencedRelation: "customer_payment_application"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_application_reversed_by_user_id_fkey"
            columns: ["reversed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payment_application_reversed_by_user_id_fkey"
            columns: ["reversed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_statement: {
        Row: {
          brand_id: string | null
          brand_scope: Database["public"]["Enums"]["customer_statement_brand_scope"]
          brand_subtotals_json: Json | null
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string
          date_from: string | null
          date_to: string | null
          email_send_history_id: string | null
          id: string
          last_generated_document_event_id: string | null
          statement_date: string
          statement_number: string
          statement_type: Database["public"]["Enums"]["customer_statement_type"]
          total_current_balance: number
          total_open_balance: number
          total_past_due_balance: number
        }
        Insert: {
          brand_id?: string | null
          brand_scope?: Database["public"]["Enums"]["customer_statement_brand_scope"]
          brand_subtotals_json?: Json | null
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id: string
          date_from?: string | null
          date_to?: string | null
          email_send_history_id?: string | null
          id?: string
          last_generated_document_event_id?: string | null
          statement_date?: string
          statement_number: string
          statement_type?: Database["public"]["Enums"]["customer_statement_type"]
          total_current_balance?: number
          total_open_balance?: number
          total_past_due_balance?: number
        }
        Update: {
          brand_id?: string | null
          brand_scope?: Database["public"]["Enums"]["customer_statement_brand_scope"]
          brand_subtotals_json?: Json | null
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string
          date_from?: string | null
          date_to?: string | null
          email_send_history_id?: string | null
          id?: string
          last_generated_document_event_id?: string | null
          statement_date?: string
          statement_number?: string
          statement_type?: Database["public"]["Enums"]["customer_statement_type"]
          total_current_balance?: number
          total_open_balance?: number
          total_past_due_balance?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_statement_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_statement_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_statement_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_statement_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_statement_email_send_history_id_fkey"
            columns: ["email_send_history_id"]
            isOneToOne: false
            referencedRelation: "email_send_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_statement_last_generated_document_event_id_fkey"
            columns: ["last_generated_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_statement_last_generated_document_event_id_fkey"
            columns: ["last_generated_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_statement_line: {
        Row: {
          balance_amount: number
          brand_id: string | null
          created_at: string
          credit_amount: number
          customer_statement_id: string
          debit_amount: number
          description: string
          due_date: string | null
          id: string
          line_type: Database["public"]["Enums"]["customer_statement_line_type"]
          sort_order: number
          source_entity_id: string
          source_entity_type: string
          transaction_date: string
        }
        Insert: {
          balance_amount?: number
          brand_id?: string | null
          created_at?: string
          credit_amount?: number
          customer_statement_id: string
          debit_amount?: number
          description: string
          due_date?: string | null
          id?: string
          line_type: Database["public"]["Enums"]["customer_statement_line_type"]
          sort_order?: number
          source_entity_id: string
          source_entity_type: string
          transaction_date: string
        }
        Update: {
          balance_amount?: number
          brand_id?: string | null
          created_at?: string
          credit_amount?: number
          customer_statement_id?: string
          debit_amount?: number
          description?: string
          due_date?: string | null
          id?: string
          line_type?: Database["public"]["Enums"]["customer_statement_line_type"]
          sort_order?: number
          source_entity_id?: string
          source_entity_type?: string
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_statement_line_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_statement_line_customer_statement_id_fkey"
            columns: ["customer_statement_id"]
            isOneToOne: false
            referencedRelation: "customer_statement"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_definition: {
        Row: {
          created_at: string
          dashboard_code: Database["public"]["Enums"]["dashboard_code"]
          default_filters_json: Json
          department: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          permission_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dashboard_code: Database["public"]["Enums"]["dashboard_code"]
          default_filters_json?: Json
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          permission_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dashboard_code?: Database["public"]["Enums"]["dashboard_code"]
          default_filters_json?: Json
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          permission_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_definition_permission_code_fkey"
            columns: ["permission_code"]
            isOneToOne: false
            referencedRelation: "active_permission_overrides"
            referencedColumns: ["permission_code"]
          },
          {
            foreignKeyName: "dashboard_definition_permission_code_fkey"
            columns: ["permission_code"]
            isOneToOne: false
            referencedRelation: "permission"
            referencedColumns: ["permission_code"]
          },
        ]
      }
      dashboard_snapshot: {
        Row: {
          brand_id: string | null
          customer_account_id: string | null
          customer_location_id: string | null
          dashboard_definition_id: string
          date_from: string | null
          date_to: string | null
          expires_at: string | null
          filters_json: Json
          generated_at: string
          generated_by_user_id: string | null
          id: string
          snapshot_scope: string
          summary_json: Json
        }
        Insert: {
          brand_id?: string | null
          customer_account_id?: string | null
          customer_location_id?: string | null
          dashboard_definition_id: string
          date_from?: string | null
          date_to?: string | null
          expires_at?: string | null
          filters_json?: Json
          generated_at?: string
          generated_by_user_id?: string | null
          id?: string
          snapshot_scope?: string
          summary_json?: Json
        }
        Update: {
          brand_id?: string | null
          customer_account_id?: string | null
          customer_location_id?: string | null
          dashboard_definition_id?: string
          date_from?: string | null
          date_to?: string | null
          expires_at?: string | null
          filters_json?: Json
          generated_at?: string
          generated_by_user_id?: string | null
          id?: string
          snapshot_scope?: string
          summary_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_snapshot_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_snapshot_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_snapshot_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_snapshot_dashboard_definition_id_fkey"
            columns: ["dashboard_definition_id"]
            isOneToOne: false
            referencedRelation: "dashboard_definition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_snapshot_generated_by_user_id_fkey"
            columns: ["generated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_snapshot_generated_by_user_id_fkey"
            columns: ["generated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      dashboard_snapshot_item: {
        Row: {
          amount_value: number | null
          count_value: number | null
          created_at: string
          dashboard_snapshot_id: string
          id: string
          item_payload_json: Json
          item_type: string
          label: string | null
          metric_value: number | null
          sort_order: number
          source_entity_id: string | null
          source_entity_type: string | null
          widget_code: string
        }
        Insert: {
          amount_value?: number | null
          count_value?: number | null
          created_at?: string
          dashboard_snapshot_id: string
          id?: string
          item_payload_json?: Json
          item_type: string
          label?: string | null
          metric_value?: number | null
          sort_order?: number
          source_entity_id?: string | null
          source_entity_type?: string | null
          widget_code: string
        }
        Update: {
          amount_value?: number | null
          count_value?: number | null
          created_at?: string
          dashboard_snapshot_id?: string
          id?: string
          item_payload_json?: Json
          item_type?: string
          label?: string | null
          metric_value?: number | null
          sort_order?: number
          source_entity_id?: string | null
          source_entity_type?: string | null
          widget_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_snapshot_item_dashboard_snapshot_id_fkey"
            columns: ["dashboard_snapshot_id"]
            isOneToOne: false
            referencedRelation: "dashboard_snapshot"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_widget_definition: {
        Row: {
          created_at: string
          dashboard_definition_id: string
          data_source_name: string | null
          default_filters_json: Json
          display_order: number
          drilldown_report_definition_id: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          widget_code: string
          widget_type: Database["public"]["Enums"]["dashboard_widget_type"]
        }
        Insert: {
          created_at?: string
          dashboard_definition_id: string
          data_source_name?: string | null
          default_filters_json?: Json
          display_order?: number
          drilldown_report_definition_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          widget_code: string
          widget_type: Database["public"]["Enums"]["dashboard_widget_type"]
        }
        Update: {
          created_at?: string
          dashboard_definition_id?: string
          data_source_name?: string | null
          default_filters_json?: Json
          display_order?: number
          drilldown_report_definition_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          widget_code?: string
          widget_type?: Database["public"]["Enums"]["dashboard_widget_type"]
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_widget_definition_dashboard_definition_id_fkey"
            columns: ["dashboard_definition_id"]
            isOneToOne: false
            referencedRelation: "dashboard_definition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_widget_definition_drilldown_report_definition_id_fkey"
            columns: ["drilldown_report_definition_id"]
            isOneToOne: false
            referencedRelation: "report_definition"
            referencedColumns: ["id"]
          },
        ]
      }
      data_import_batch: {
        Row: {
          approved_at: string | null
          approved_by_user_id: string | null
          batch_number: string
          completed_at: string | null
          created_by_user_id: string | null
          environment: string
          failed_rows: number
          id: string
          import_type: string
          notes: string | null
          source_file_name: string | null
          source_system: string
          started_at: string | null
          status: Database["public"]["Enums"]["import_status"]
          success_rows: number
          total_rows: number
          warning_rows: number
        }
        Insert: {
          approved_at?: string | null
          approved_by_user_id?: string | null
          batch_number: string
          completed_at?: string | null
          created_by_user_id?: string | null
          environment?: string
          failed_rows?: number
          id?: string
          import_type: string
          notes?: string | null
          source_file_name?: string | null
          source_system: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          success_rows?: number
          total_rows?: number
          warning_rows?: number
        }
        Update: {
          approved_at?: string | null
          approved_by_user_id?: string | null
          batch_number?: string
          completed_at?: string | null
          created_by_user_id?: string | null
          environment?: string
          failed_rows?: number
          id?: string
          import_type?: string
          notes?: string | null
          source_file_name?: string | null
          source_system?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          success_rows?: number
          total_rows?: number
          warning_rows?: number
        }
        Relationships: [
          {
            foreignKeyName: "data_import_batch_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_import_batch_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "data_import_batch_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_import_batch_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      data_import_record: {
        Row: {
          created_at: string
          data_import_batch_id: string
          erp_entity_id: string | null
          erp_entity_type: string | null
          id: string
          message: string | null
          source_entity_id: string | null
          source_entity_type: string
          source_payload_json: Json | null
          source_row_number: number | null
          status: Database["public"]["Enums"]["record_import_status"]
        }
        Insert: {
          created_at?: string
          data_import_batch_id: string
          erp_entity_id?: string | null
          erp_entity_type?: string | null
          id?: string
          message?: string | null
          source_entity_id?: string | null
          source_entity_type: string
          source_payload_json?: Json | null
          source_row_number?: number | null
          status: Database["public"]["Enums"]["record_import_status"]
        }
        Update: {
          created_at?: string
          data_import_batch_id?: string
          erp_entity_id?: string | null
          erp_entity_type?: string | null
          id?: string
          message?: string | null
          source_entity_id?: string | null
          source_entity_type?: string
          source_payload_json?: Json | null
          source_row_number?: number | null
          status?: Database["public"]["Enums"]["record_import_status"]
        }
        Relationships: [
          {
            foreignKeyName: "data_import_record_data_import_batch_id_fkey"
            columns: ["data_import_batch_id"]
            isOneToOne: false
            referencedRelation: "data_import_batch"
            referencedColumns: ["id"]
          },
        ]
      }
      document_generation_policy: {
        Row: {
          allow_download: boolean
          allow_email: boolean
          allow_preview: boolean
          audience: Database["public"]["Enums"]["document_audience"]
          brand_id: string | null
          combined_logo_file_id: string | null
          created_at: string
          created_by_user_id: string | null
          default_document_template_id: string | null
          default_email_template_id: string | null
          default_output_format: Database["public"]["Enums"]["document_output_format"]
          document_type: string
          id: string
          include_logo_header: boolean
          is_active: boolean
          logo_scope: Database["public"]["Enums"]["document_template_scope"]
          notes: string | null
          store_generated_file_copy: boolean
          template_scope: Database["public"]["Enums"]["document_template_scope"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          allow_download?: boolean
          allow_email?: boolean
          allow_preview?: boolean
          audience: Database["public"]["Enums"]["document_audience"]
          brand_id?: string | null
          combined_logo_file_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          default_document_template_id?: string | null
          default_email_template_id?: string | null
          default_output_format?: Database["public"]["Enums"]["document_output_format"]
          document_type: string
          id?: string
          include_logo_header?: boolean
          is_active?: boolean
          logo_scope?: Database["public"]["Enums"]["document_template_scope"]
          notes?: string | null
          store_generated_file_copy?: boolean
          template_scope: Database["public"]["Enums"]["document_template_scope"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          allow_download?: boolean
          allow_email?: boolean
          allow_preview?: boolean
          audience?: Database["public"]["Enums"]["document_audience"]
          brand_id?: string | null
          combined_logo_file_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          default_document_template_id?: string | null
          default_email_template_id?: string | null
          default_output_format?: Database["public"]["Enums"]["document_output_format"]
          document_type?: string
          id?: string
          include_logo_header?: boolean
          is_active?: boolean
          logo_scope?: Database["public"]["Enums"]["document_template_scope"]
          notes?: string | null
          store_generated_file_copy?: boolean
          template_scope?: Database["public"]["Enums"]["document_template_scope"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_generation_policy_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_generation_policy_combined_logo_file_id_fkey"
            columns: ["combined_logo_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_generation_policy_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_generation_policy_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "document_generation_policy_default_document_template_id_fkey"
            columns: ["default_document_template_id"]
            isOneToOne: false
            referencedRelation: "document_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_generation_policy_default_email_template_id_fkey"
            columns: ["default_email_template_id"]
            isOneToOne: false
            referencedRelation: "email_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_generation_policy_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_generation_policy_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      document_merge_field_definition: {
        Row: {
          created_at: string
          data_path: string
          description: string | null
          entity_type: string
          id: string
          is_active: boolean
          label: string
          merge_field_code: string
          sample_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_path: string
          description?: string | null
          entity_type: string
          id?: string
          is_active?: boolean
          label: string
          merge_field_code: string
          sample_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_path?: string
          description?: string | null
          entity_type?: string
          id?: string
          is_active?: boolean
          label?: string
          merge_field_code?: string
          sample_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      document_number_sequence: {
        Row: {
          brand_id: string | null
          document_type: string
          id: string
          is_active: boolean
          next_number: number
          padding_length: number
          prefix: string | null
          sequence_code: string
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          document_type: string
          id?: string
          is_active?: boolean
          next_number?: number
          padding_length?: number
          prefix?: string | null
          sequence_code: string
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          document_type?: string
          id?: string
          is_active?: boolean
          next_number?: number
          padding_length?: number
          prefix?: string | null
          sequence_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_number_sequence_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      document_recipient_rule: {
        Row: {
          allow_manual_override: boolean
          brand_id: string | null
          cc_recipient_sources: Database["public"]["Enums"]["document_recipient_source"][]
          created_at: string
          created_by_user_id: string | null
          document_type: string
          entity_type: string
          fallback_to_manual_entry: boolean
          id: string
          is_active: boolean
          notes: string | null
          primary_recipient_source: Database["public"]["Enums"]["document_recipient_source"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          allow_manual_override?: boolean
          brand_id?: string | null
          cc_recipient_sources?: Database["public"]["Enums"]["document_recipient_source"][]
          created_at?: string
          created_by_user_id?: string | null
          document_type: string
          entity_type: string
          fallback_to_manual_entry?: boolean
          id?: string
          is_active?: boolean
          notes?: string | null
          primary_recipient_source: Database["public"]["Enums"]["document_recipient_source"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          allow_manual_override?: boolean
          brand_id?: string | null
          cc_recipient_sources?: Database["public"]["Enums"]["document_recipient_source"][]
          created_at?: string
          created_by_user_id?: string | null
          document_type?: string
          entity_type?: string
          fallback_to_manual_entry?: boolean
          id?: string
          is_active?: boolean
          notes?: string | null
          primary_recipient_source?: Database["public"]["Enums"]["document_recipient_source"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_recipient_rule_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_recipient_rule_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_recipient_rule_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "document_recipient_rule_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_recipient_rule_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      document_template: {
        Row: {
          audience: Database["public"]["Enums"]["document_audience"]
          available_merge_fields_json: Json
          brand_id: string | null
          combined_logo_file_id: string | null
          created_at: string
          created_by_user_id: string | null
          document_type: string
          footer_asset_file_id: string | null
          header_asset_file_id: string | null
          id: string
          include_header_on_internal_pdf: boolean
          is_active: boolean
          is_default: boolean
          output_format: Database["public"]["Enums"]["document_output_format"]
          render_options_json: Json
          show_logo: boolean
          template_code: string
          template_file_id: string | null
          template_file_name: string | null
          template_file_path: string | null
          template_name: string
          template_scope: Database["public"]["Enums"]["document_template_scope"]
          template_variant: string
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          audience?: Database["public"]["Enums"]["document_audience"]
          available_merge_fields_json?: Json
          brand_id?: string | null
          combined_logo_file_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          document_type: string
          footer_asset_file_id?: string | null
          header_asset_file_id?: string | null
          id?: string
          include_header_on_internal_pdf?: boolean
          is_active?: boolean
          is_default?: boolean
          output_format?: Database["public"]["Enums"]["document_output_format"]
          render_options_json?: Json
          show_logo?: boolean
          template_code: string
          template_file_id?: string | null
          template_file_name?: string | null
          template_file_path?: string | null
          template_name: string
          template_scope: Database["public"]["Enums"]["document_template_scope"]
          template_variant?: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          audience?: Database["public"]["Enums"]["document_audience"]
          available_merge_fields_json?: Json
          brand_id?: string | null
          combined_logo_file_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          document_type?: string
          footer_asset_file_id?: string | null
          header_asset_file_id?: string | null
          id?: string
          include_header_on_internal_pdf?: boolean
          is_active?: boolean
          is_default?: boolean
          output_format?: Database["public"]["Enums"]["document_output_format"]
          render_options_json?: Json
          show_logo?: boolean
          template_code?: string
          template_file_id?: string | null
          template_file_name?: string | null
          template_file_path?: string | null
          template_name?: string
          template_scope?: Database["public"]["Enums"]["document_template_scope"]
          template_variant?: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_template_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_template_combined_logo_file_id_fkey"
            columns: ["combined_logo_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_template_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_template_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "document_template_footer_asset_file_id_fkey"
            columns: ["footer_asset_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_template_header_asset_file_id_fkey"
            columns: ["header_asset_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_template_template_file_id_fkey"
            columns: ["template_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_template_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_template_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      document_template_version: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          document_template_id: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          notes: string | null
          render_options_json: Json
          template_file_id: string | null
          template_file_name: string | null
          template_file_path: string | null
          version_label: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          document_template_id: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          render_options_json?: Json
          template_file_id?: string | null
          template_file_name?: string | null
          template_file_path?: string | null
          version_label: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          document_template_id?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          render_options_json?: Json
          template_file_id?: string | null
          template_file_name?: string | null
          template_file_path?: string | null
          version_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_template_version_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_template_version_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "document_template_version_document_template_id_fkey"
            columns: ["document_template_id"]
            isOneToOne: false
            referencedRelation: "document_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_template_version_template_file_id_fkey"
            columns: ["template_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_history: {
        Row: {
          attachment_ids_json: Json | null
          bcc_addresses: string[]
          body_snapshot: string
          cc_addresses: string[]
          created_at: string
          email_template_id: string | null
          entity_id: string | null
          entity_type: string
          error_message: string | null
          from_identity_snapshot: string | null
          generated_document_refs_json: Json | null
          id: string
          manual_recipient_override: boolean
          recipient_source:
            | Database["public"]["Enums"]["document_recipient_source"]
            | null
          related_generated_document_event_id: string | null
          send_status: string
          sent_at: string | null
          sent_by_user_id: string | null
          subject_snapshot: string
          to_addresses: string[]
        }
        Insert: {
          attachment_ids_json?: Json | null
          bcc_addresses?: string[]
          body_snapshot: string
          cc_addresses?: string[]
          created_at?: string
          email_template_id?: string | null
          entity_id?: string | null
          entity_type: string
          error_message?: string | null
          from_identity_snapshot?: string | null
          generated_document_refs_json?: Json | null
          id?: string
          manual_recipient_override?: boolean
          recipient_source?:
            | Database["public"]["Enums"]["document_recipient_source"]
            | null
          related_generated_document_event_id?: string | null
          send_status?: string
          sent_at?: string | null
          sent_by_user_id?: string | null
          subject_snapshot: string
          to_addresses?: string[]
        }
        Update: {
          attachment_ids_json?: Json | null
          bcc_addresses?: string[]
          body_snapshot?: string
          cc_addresses?: string[]
          created_at?: string
          email_template_id?: string | null
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          from_identity_snapshot?: string | null
          generated_document_refs_json?: Json | null
          id?: string
          manual_recipient_override?: boolean
          recipient_source?:
            | Database["public"]["Enums"]["document_recipient_source"]
            | null
          related_generated_document_event_id?: string | null
          send_status?: string
          sent_at?: string | null
          sent_by_user_id?: string | null
          subject_snapshot?: string
          to_addresses?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "email_send_history_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_send_history_related_generated_document_event_id_fkey"
            columns: ["related_generated_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_send_history_related_generated_document_event_id_fkey"
            columns: ["related_generated_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_send_history_sent_by_user_id_fkey"
            columns: ["sent_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_send_history_sent_by_user_id_fkey"
            columns: ["sent_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      email_template: {
        Row: {
          available_merge_fields_json: Json
          body_template: string
          brand_id: string | null
          created_at: string
          created_by_user_id: string | null
          default_from_identity: string | null
          entity_type: string
          id: string
          is_active: boolean
          name: string
          subject_template: string
          template_code: string
          template_type: string
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          available_merge_fields_json?: Json
          body_template: string
          brand_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          default_from_identity?: string | null
          entity_type: string
          id?: string
          is_active?: boolean
          name: string
          subject_template: string
          template_code: string
          template_type: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          available_merge_fields_json?: Json
          body_template?: string
          brand_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          default_from_identity?: string | null
          entity_type?: string
          id?: string
          is_active?: boolean
          name?: string
          subject_template?: string
          template_code?: string
          template_type?: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_template_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_template_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_template_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "email_template_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_template_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      factory_inspection: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          emailed_at: string | null
          id: string
          inspection_date: string
          inspection_number: string
          inspection_status: Database["public"]["Enums"]["factory_inspection_status"]
          inspector_user_id: string | null
          report_file_id: string | null
          summary: string | null
          updated_at: string
          updated_by_user_id: string | null
          vendor_purchase_order_id: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          emailed_at?: string | null
          id?: string
          inspection_date?: string
          inspection_number?: string
          inspection_status?: Database["public"]["Enums"]["factory_inspection_status"]
          inspector_user_id?: string | null
          report_file_id?: string | null
          summary?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_purchase_order_id: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          emailed_at?: string | null
          id?: string
          inspection_date?: string
          inspection_number?: string
          inspection_status?: Database["public"]["Enums"]["factory_inspection_status"]
          inspector_user_id?: string | null
          report_file_id?: string | null
          summary?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_purchase_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_inspection_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factory_inspection_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "factory_inspection_inspector_user_id_fkey"
            columns: ["inspector_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factory_inspection_inspector_user_id_fkey"
            columns: ["inspector_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "factory_inspection_report_file_id_fkey"
            columns: ["report_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factory_inspection_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factory_inspection_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "factory_inspection_vendor_purchase_order_id_fkey"
            columns: ["vendor_purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchasing_dashboard_open_items"
            referencedColumns: ["vendor_purchase_order_id"]
          },
          {
            foreignKeyName: "factory_inspection_vendor_purchase_order_id_fkey"
            columns: ["vendor_purchase_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_purchase_order"
            referencedColumns: ["id"]
          },
        ]
      }
      factory_inspection_line: {
        Row: {
          actual_result: string | null
          checkpoint_name: string
          created_at: string
          expected_result: string | null
          factory_inspection_id: string
          id: string
          notes: string | null
          pass_fail_status: Database["public"]["Enums"]["inspection_result_status"]
          photo_required: boolean
          product_id: string | null
          vendor_purchase_order_line_id: string | null
        }
        Insert: {
          actual_result?: string | null
          checkpoint_name: string
          created_at?: string
          expected_result?: string | null
          factory_inspection_id: string
          id?: string
          notes?: string | null
          pass_fail_status?: Database["public"]["Enums"]["inspection_result_status"]
          photo_required?: boolean
          product_id?: string | null
          vendor_purchase_order_line_id?: string | null
        }
        Update: {
          actual_result?: string | null
          checkpoint_name?: string
          created_at?: string
          expected_result?: string | null
          factory_inspection_id?: string
          id?: string
          notes?: string | null
          pass_fail_status?: Database["public"]["Enums"]["inspection_result_status"]
          photo_required?: boolean
          product_id?: string | null
          vendor_purchase_order_line_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "factory_inspection_line_factory_inspection_id_fkey"
            columns: ["factory_inspection_id"]
            isOneToOne: false
            referencedRelation: "factory_inspection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factory_inspection_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "factory_inspection_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factory_inspection_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "factory_inspection_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "factory_inspection_line_vendor_purchase_order_line_id_fkey"
            columns: ["vendor_purchase_order_line_id"]
            isOneToOne: false
            referencedRelation: "vendor_purchase_order_line"
            referencedColumns: ["id"]
          },
        ]
      }
      finish: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          deleted_at: string | null
          deleted_by_user_id: string | null
          description: string | null
          finish_image_file_id: string | null
          finish_name: string
          id: string
          is_active: boolean
          sort_order: number
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          description?: string | null
          finish_image_file_id?: string | null
          finish_name: string
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          description?: string | null
          finish_image_file_id?: string | null
          finish_name?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finish_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finish_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "finish_deleted_by_user_id_fkey"
            columns: ["deleted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finish_deleted_by_user_id_fkey"
            columns: ["deleted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "finish_finish_image_file_id_fkey"
            columns: ["finish_image_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finish_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finish_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      freight_shipment: {
        Row: {
          actual_delivery_date: string | null
          bol_document_file_id: string | null
          bol_number: string | null
          carrier: string | null
          carrier_account_number_snapshot: string | null
          carton_count: number
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string
          estimated_delivery_date: string | null
          freight_class: string | null
          freight_cost: number
          freight_shipment_number: string
          freight_terms_snapshot: Database["public"]["Enums"]["freight_terms"]
          id: string
          is_dropship: boolean
          master_tracking_number: string | null
          notes: string | null
          pallet_count: number | null
          pickup_date: string | null
          pro_number: string | null
          ship_date: string | null
          ship_to_hash: string | null
          ship_to_location_id: string | null
          ship_to_snapshot_json: Json
          ship_to_type: Database["public"]["Enums"]["sales_order_ship_to_type"]
          shipped_by_user_id: string | null
          shipping_type: Database["public"]["Enums"]["shipping_type"] | null
          status: Database["public"]["Enums"]["freight_shipment_status"]
          total_cbm: number | null
          total_gross_weight: number
          total_inch_volume: number
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          bol_document_file_id?: string | null
          bol_number?: string | null
          carrier?: string | null
          carrier_account_number_snapshot?: string | null
          carton_count?: number
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id: string
          estimated_delivery_date?: string | null
          freight_class?: string | null
          freight_cost?: number
          freight_shipment_number?: string
          freight_terms_snapshot?: Database["public"]["Enums"]["freight_terms"]
          id?: string
          is_dropship?: boolean
          master_tracking_number?: string | null
          notes?: string | null
          pallet_count?: number | null
          pickup_date?: string | null
          pro_number?: string | null
          ship_date?: string | null
          ship_to_hash?: string | null
          ship_to_location_id?: string | null
          ship_to_snapshot_json: Json
          ship_to_type: Database["public"]["Enums"]["sales_order_ship_to_type"]
          shipped_by_user_id?: string | null
          shipping_type?: Database["public"]["Enums"]["shipping_type"] | null
          status?: Database["public"]["Enums"]["freight_shipment_status"]
          total_cbm?: number | null
          total_gross_weight?: number
          total_inch_volume?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          bol_document_file_id?: string | null
          bol_number?: string | null
          carrier?: string | null
          carrier_account_number_snapshot?: string | null
          carton_count?: number
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string
          estimated_delivery_date?: string | null
          freight_class?: string | null
          freight_cost?: number
          freight_shipment_number?: string
          freight_terms_snapshot?: Database["public"]["Enums"]["freight_terms"]
          id?: string
          is_dropship?: boolean
          master_tracking_number?: string | null
          notes?: string | null
          pallet_count?: number | null
          pickup_date?: string | null
          pro_number?: string | null
          ship_date?: string | null
          ship_to_hash?: string | null
          ship_to_location_id?: string | null
          ship_to_snapshot_json?: Json
          ship_to_type?: Database["public"]["Enums"]["sales_order_ship_to_type"]
          shipped_by_user_id?: string | null
          shipping_type?: Database["public"]["Enums"]["shipping_type"] | null
          status?: Database["public"]["Enums"]["freight_shipment_status"]
          total_cbm?: number | null
          total_gross_weight?: number
          total_inch_volume?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freight_shipment_bol_document_file_id_fkey"
            columns: ["bol_document_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_shipment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_shipment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "freight_shipment_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_shipment_ship_to_location_id_fkey"
            columns: ["ship_to_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_shipment_shipped_by_user_id_fkey"
            columns: ["shipped_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_shipment_shipped_by_user_id_fkey"
            columns: ["shipped_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "freight_shipment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_shipment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      generated_document_event: {
        Row: {
          action_type: string
          action_type_normalized:
            | Database["public"]["Enums"]["document_action_type"]
            | null
          audience: Database["public"]["Enums"]["document_audience"] | null
          brand_id: string | null
          document_number: string | null
          document_template_id: string | null
          document_type: string
          email_send_history_id: string | null
          entity_id: string | null
          entity_type: string
          generated_at: string
          generated_by_user_id: string | null
          id: string
          metadata_json: Json
          output_format: string
          output_format_normalized:
            | Database["public"]["Enums"]["document_output_format"]
            | null
          render_parameters_json: Json
          source_snapshot_refs_json: Json
        }
        Insert: {
          action_type: string
          action_type_normalized?:
            | Database["public"]["Enums"]["document_action_type"]
            | null
          audience?: Database["public"]["Enums"]["document_audience"] | null
          brand_id?: string | null
          document_number?: string | null
          document_template_id?: string | null
          document_type: string
          email_send_history_id?: string | null
          entity_id?: string | null
          entity_type: string
          generated_at?: string
          generated_by_user_id?: string | null
          id?: string
          metadata_json?: Json
          output_format: string
          output_format_normalized?:
            | Database["public"]["Enums"]["document_output_format"]
            | null
          render_parameters_json?: Json
          source_snapshot_refs_json?: Json
        }
        Update: {
          action_type?: string
          action_type_normalized?:
            | Database["public"]["Enums"]["document_action_type"]
            | null
          audience?: Database["public"]["Enums"]["document_audience"] | null
          brand_id?: string | null
          document_number?: string | null
          document_template_id?: string | null
          document_type?: string
          email_send_history_id?: string | null
          entity_id?: string | null
          entity_type?: string
          generated_at?: string
          generated_by_user_id?: string | null
          id?: string
          metadata_json?: Json
          output_format?: string
          output_format_normalized?:
            | Database["public"]["Enums"]["document_output_format"]
            | null
          render_parameters_json?: Json
          source_snapshot_refs_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "generated_document_event_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_document_event_document_template_id_fkey"
            columns: ["document_template_id"]
            isOneToOne: false
            referencedRelation: "document_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_document_event_email_send_history_id_fkey"
            columns: ["email_send_history_id"]
            isOneToOne: false
            referencedRelation: "email_send_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_document_event_generated_by_user_id_fkey"
            columns: ["generated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_document_event_generated_by_user_id_fkey"
            columns: ["generated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      go_live_issue: {
        Row: {
          assigned_to_user_id: string | null
          business_impact: string | null
          created_at: string
          department: string | null
          description: string | null
          id: string
          issue_number: string
          issue_type: string
          module_area: string
          related_entity_id: string | null
          related_entity_type: string | null
          reported_by_user_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["defect_severity"]
          status: Database["public"]["Enums"]["defect_status"]
          title: string
          workaround: string | null
        }
        Insert: {
          assigned_to_user_id?: string | null
          business_impact?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          issue_number: string
          issue_type: string
          module_area: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          reported_by_user_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["defect_severity"]
          status?: Database["public"]["Enums"]["defect_status"]
          title: string
          workaround?: string | null
        }
        Update: {
          assigned_to_user_id?: string | null
          business_impact?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          issue_number?: string
          issue_type?: string
          module_area?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          reported_by_user_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["defect_severity"]
          status?: Database["public"]["Enums"]["defect_status"]
          title?: string
          workaround?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "go_live_issue_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "go_live_issue_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "go_live_issue_reported_by_user_id_fkey"
            columns: ["reported_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "go_live_issue_reported_by_user_id_fkey"
            columns: ["reported_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      import_container: {
        Row: {
          arrival_date: string | null
          booking_number: string | null
          carrier: string | null
          container_number: string
          container_status: Database["public"]["Enums"]["import_container_status"]
          created_at: string
          created_by_user_id: string | null
          customs_status: Database["public"]["Enums"]["container_customs_status"]
          destination_warehouse_id: string | null
          eta: string | null
          etd: string | null
          id: string
          notes: string | null
          seal_number: string | null
          shipping_agency: string | null
          updated_at: string
          updated_by_user_id: string | null
          vessel_name: string | null
          voyage_number: string | null
        }
        Insert: {
          arrival_date?: string | null
          booking_number?: string | null
          carrier?: string | null
          container_number: string
          container_status?: Database["public"]["Enums"]["import_container_status"]
          created_at?: string
          created_by_user_id?: string | null
          customs_status?: Database["public"]["Enums"]["container_customs_status"]
          destination_warehouse_id?: string | null
          eta?: string | null
          etd?: string | null
          id?: string
          notes?: string | null
          seal_number?: string | null
          shipping_agency?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          vessel_name?: string | null
          voyage_number?: string | null
        }
        Update: {
          arrival_date?: string | null
          booking_number?: string | null
          carrier?: string | null
          container_number?: string
          container_status?: Database["public"]["Enums"]["import_container_status"]
          created_at?: string
          created_by_user_id?: string | null
          customs_status?: Database["public"]["Enums"]["container_customs_status"]
          destination_warehouse_id?: string | null
          eta?: string | null
          etd?: string | null
          id?: string
          notes?: string | null
          seal_number?: string | null
          shipping_agency?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          vessel_name?: string | null
          voyage_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_container_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_container_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "import_container_destination_warehouse_id_fkey"
            columns: ["destination_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_container_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_container_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      import_container_line: {
        Row: {
          carton_count: number | null
          cbm: number | null
          created_at: string
          created_by_user_id: string | null
          gross_weight: number | null
          id: string
          import_container_id: string
          is_active: boolean
          notes: string | null
          product_id: string
          quantity_packed: number
          quantity_received: number
          updated_at: string
          updated_by_user_id: string | null
          vendor_purchase_order_line_id: string
        }
        Insert: {
          carton_count?: number | null
          cbm?: number | null
          created_at?: string
          created_by_user_id?: string | null
          gross_weight?: number | null
          id?: string
          import_container_id: string
          is_active?: boolean
          notes?: string | null
          product_id: string
          quantity_packed: number
          quantity_received?: number
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_purchase_order_line_id: string
        }
        Update: {
          carton_count?: number | null
          cbm?: number | null
          created_at?: string
          created_by_user_id?: string | null
          gross_weight?: number | null
          id?: string
          import_container_id?: string
          is_active?: boolean
          notes?: string | null
          product_id?: string
          quantity_packed?: number
          quantity_received?: number
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_purchase_order_line_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_container_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_container_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "import_container_line_import_container_id_fkey"
            columns: ["import_container_id"]
            isOneToOne: false
            referencedRelation: "import_container"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_container_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "import_container_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_container_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "import_container_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "import_container_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_container_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "import_container_line_vendor_purchase_order_line_id_fkey"
            columns: ["vendor_purchase_order_line_id"]
            isOneToOne: false
            referencedRelation: "vendor_purchase_order_line"
            referencedColumns: ["id"]
          },
        ]
      }
      incoming_inventory: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          expected_date: string | null
          expected_quantity: number
          id: string
          import_container_line_id: string | null
          notes: string | null
          pre_allocated_quantity: number
          product_id: string
          product_packing_box_id: string | null
          received_quantity: number
          source_reference: string | null
          status: Database["public"]["Enums"]["incoming_inventory_status"]
          updated_at: string
          updated_by_user_id: string | null
          vendor_purchase_order_line_id: string | null
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          expected_date?: string | null
          expected_quantity: number
          id?: string
          import_container_line_id?: string | null
          notes?: string | null
          pre_allocated_quantity?: number
          product_id: string
          product_packing_box_id?: string | null
          received_quantity?: number
          source_reference?: string | null
          status?: Database["public"]["Enums"]["incoming_inventory_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_purchase_order_line_id?: string | null
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          expected_date?: string | null
          expected_quantity?: number
          id?: string
          import_container_line_id?: string | null
          notes?: string | null
          pre_allocated_quantity?: number
          product_id?: string
          product_packing_box_id?: string | null
          received_quantity?: number
          source_reference?: string | null
          status?: Database["public"]["Enums"]["incoming_inventory_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_purchase_order_line_id?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incoming_inventory_container_line_fkey"
            columns: ["import_container_line_id"]
            isOneToOne: false
            referencedRelation: "import_container_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incoming_inventory_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incoming_inventory_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "incoming_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "incoming_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incoming_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "incoming_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "incoming_inventory_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_packing_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incoming_inventory_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_packing_box_id"]
          },
          {
            foreignKeyName: "incoming_inventory_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incoming_inventory_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "incoming_inventory_vendor_po_line_fkey"
            columns: ["vendor_purchase_order_line_id"]
            isOneToOne: false
            referencedRelation: "vendor_purchase_order_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incoming_inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_adjustment: {
        Row: {
          adjusted_at: string | null
          adjusted_by_user_id: string | null
          adjustment_number: string
          adjustment_quantity: number
          created_at: string
          created_by_user_id: string | null
          id: string
          inventory_adjustment_reason_id: string
          inventory_condition: Database["public"]["Enums"]["inventory_condition"]
          inventory_movement_id: string | null
          notes: string | null
          product_id: string
          product_packing_box_id: string | null
          status: Database["public"]["Enums"]["inventory_adjustment_status"]
          updated_at: string
          updated_by_user_id: string | null
          warehouse_id: string
          warehouse_location_id: string
        }
        Insert: {
          adjusted_at?: string | null
          adjusted_by_user_id?: string | null
          adjustment_number?: string
          adjustment_quantity: number
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          inventory_adjustment_reason_id: string
          inventory_condition: Database["public"]["Enums"]["inventory_condition"]
          inventory_movement_id?: string | null
          notes?: string | null
          product_id: string
          product_packing_box_id?: string | null
          status?: Database["public"]["Enums"]["inventory_adjustment_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id: string
          warehouse_location_id: string
        }
        Update: {
          adjusted_at?: string | null
          adjusted_by_user_id?: string | null
          adjustment_number?: string
          adjustment_quantity?: number
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          inventory_adjustment_reason_id?: string
          inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          inventory_movement_id?: string | null
          notes?: string | null
          product_id?: string
          product_packing_box_id?: string | null
          status?: Database["public"]["Enums"]["inventory_adjustment_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id?: string
          warehouse_location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_adjustment_adjusted_by_user_id_fkey"
            columns: ["adjusted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustment_adjusted_by_user_id_fkey"
            columns: ["adjusted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inventory_adjustment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inventory_adjustment_inventory_adjustment_reason_id_fkey"
            columns: ["inventory_adjustment_reason_id"]
            isOneToOne: false
            referencedRelation: "inventory_adjustment_reason"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustment_inventory_movement_id_fkey"
            columns: ["inventory_movement_id"]
            isOneToOne: false
            referencedRelation: "inventory_movement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustment_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_adjustment_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustment_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_adjustment_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_adjustment_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_packing_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustment_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_packing_box_id"]
          },
          {
            foreignKeyName: "inventory_adjustment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inventory_adjustment_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustment_warehouse_location_id_fkey"
            columns: ["warehouse_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_adjustment_reason: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          reason_code: string
          requires_notes: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          reason_code: string
          requires_notes?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          reason_code?: string
          requires_notes?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      inventory_allocation: {
        Row: {
          allocated_at: string
          allocated_by_user_id: string | null
          allocation_status: Database["public"]["Enums"]["inventory_allocation_status"]
          allocation_type: Database["public"]["Enums"]["inventory_allocation_type"]
          created_at: string
          id: string
          incoming_inventory_id: string | null
          inventory_balance_id: string | null
          notes: string | null
          product_id: string
          product_packing_box_id: string | null
          quantity_allocated: number
          released_at: string | null
          sales_order_line_id: string | null
          updated_at: string
          warehouse_id: string | null
          warehouse_location_id: string | null
        }
        Insert: {
          allocated_at?: string
          allocated_by_user_id?: string | null
          allocation_status?: Database["public"]["Enums"]["inventory_allocation_status"]
          allocation_type: Database["public"]["Enums"]["inventory_allocation_type"]
          created_at?: string
          id?: string
          incoming_inventory_id?: string | null
          inventory_balance_id?: string | null
          notes?: string | null
          product_id: string
          product_packing_box_id?: string | null
          quantity_allocated: number
          released_at?: string | null
          sales_order_line_id?: string | null
          updated_at?: string
          warehouse_id?: string | null
          warehouse_location_id?: string | null
        }
        Update: {
          allocated_at?: string
          allocated_by_user_id?: string | null
          allocation_status?: Database["public"]["Enums"]["inventory_allocation_status"]
          allocation_type?: Database["public"]["Enums"]["inventory_allocation_type"]
          created_at?: string
          id?: string
          incoming_inventory_id?: string | null
          inventory_balance_id?: string | null
          notes?: string | null
          product_id?: string
          product_packing_box_id?: string | null
          quantity_allocated?: number
          released_at?: string | null
          sales_order_line_id?: string | null
          updated_at?: string
          warehouse_id?: string | null
          warehouse_location_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_allocation_allocated_by_user_id_fkey"
            columns: ["allocated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_allocation_allocated_by_user_id_fkey"
            columns: ["allocated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inventory_allocation_incoming_inventory_id_fkey"
            columns: ["incoming_inventory_id"]
            isOneToOne: false
            referencedRelation: "incoming_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_allocation_inventory_balance_id_fkey"
            columns: ["inventory_balance_id"]
            isOneToOne: false
            referencedRelation: "inventory_balance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_allocation_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_allocation_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_allocation_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_allocation_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_allocation_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_packing_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_allocation_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_packing_box_id"]
          },
          {
            foreignKeyName: "inventory_allocation_sales_order_line_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "rga_available_sales_order_lines"
            referencedColumns: ["sales_order_line_id"]
          },
          {
            foreignKeyName: "inventory_allocation_sales_order_line_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "sales_order_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_allocation_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_allocation_warehouse_location_id_fkey"
            columns: ["warehouse_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_balance: {
        Row: {
          created_at: string
          id: string
          inventory_condition: Database["public"]["Enums"]["inventory_condition"]
          last_movement_at: string | null
          product_id: string
          product_packing_box_id: string | null
          quantity_allocated: number
          quantity_available: number
          quantity_on_hand: number
          updated_at: string
          warehouse_id: string
          warehouse_location_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          last_movement_at?: string | null
          product_id: string
          product_packing_box_id?: string | null
          quantity_allocated?: number
          quantity_available?: number
          quantity_on_hand?: number
          updated_at?: string
          warehouse_id: string
          warehouse_location_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          last_movement_at?: string | null
          product_id?: string
          product_packing_box_id?: string | null
          quantity_allocated?: number
          quantity_available?: number
          quantity_on_hand?: number
          updated_at?: string
          warehouse_id?: string
          warehouse_location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_balance_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_balance_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_balance_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_balance_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_balance_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_packing_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_balance_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_packing_box_id"]
          },
          {
            foreignKeyName: "inventory_balance_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_balance_warehouse_location_id_fkey"
            columns: ["warehouse_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movement: {
        Row: {
          created_at: string
          from_condition:
            | Database["public"]["Enums"]["inventory_condition"]
            | null
          from_location_id: string | null
          id: string
          movement_type: Database["public"]["Enums"]["inventory_movement_type"]
          notes: string | null
          performed_at: string
          performed_by_user_id: string | null
          product_id: string
          product_packing_box_id: string | null
          quantity: number
          reason_code: string | null
          source_entity_id: string | null
          source_entity_type: string | null
          to_condition:
            | Database["public"]["Enums"]["inventory_condition"]
            | null
          to_location_id: string | null
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          from_condition?:
            | Database["public"]["Enums"]["inventory_condition"]
            | null
          from_location_id?: string | null
          id?: string
          movement_type: Database["public"]["Enums"]["inventory_movement_type"]
          notes?: string | null
          performed_at?: string
          performed_by_user_id?: string | null
          product_id: string
          product_packing_box_id?: string | null
          quantity: number
          reason_code?: string | null
          source_entity_id?: string | null
          source_entity_type?: string | null
          to_condition?:
            | Database["public"]["Enums"]["inventory_condition"]
            | null
          to_location_id?: string | null
          warehouse_id: string
        }
        Update: {
          created_at?: string
          from_condition?:
            | Database["public"]["Enums"]["inventory_condition"]
            | null
          from_location_id?: string | null
          id?: string
          movement_type?: Database["public"]["Enums"]["inventory_movement_type"]
          notes?: string | null
          performed_at?: string
          performed_by_user_id?: string | null
          product_id?: string
          product_packing_box_id?: string | null
          quantity?: number
          reason_code?: string | null
          source_entity_id?: string | null
          source_entity_type?: string | null
          to_condition?:
            | Database["public"]["Enums"]["inventory_condition"]
            | null
          to_location_id?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movement_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movement_performed_by_user_id_fkey"
            columns: ["performed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movement_performed_by_user_id_fkey"
            columns: ["performed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inventory_movement_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_movement_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movement_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_movement_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_movement_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_packing_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movement_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_packing_box_id"]
          },
          {
            foreignKeyName: "inventory_movement_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movement_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_id_map: {
        Row: {
          created_at: string
          data_import_batch_id: string | null
          erp_entity_id: string
          erp_entity_type: string
          id: string
          source_entity_id: string
          source_entity_type: string
          source_system: string
        }
        Insert: {
          created_at?: string
          data_import_batch_id?: string | null
          erp_entity_id: string
          erp_entity_type: string
          id?: string
          source_entity_id: string
          source_entity_type: string
          source_system: string
        }
        Update: {
          created_at?: string
          data_import_batch_id?: string | null
          erp_entity_id?: string
          erp_entity_type?: string
          id?: string
          source_entity_id?: string
          source_entity_type?: string
          source_system?: string
        }
        Relationships: [
          {
            foreignKeyName: "legacy_id_map_data_import_batch_id_fkey"
            columns: ["data_import_batch_id"]
            isOneToOne: false
            referencedRelation: "data_import_batch"
            referencedColumns: ["id"]
          },
        ]
      }
      packing_list: {
        Row: {
          allocated_freight_cost: number
          carrier_snapshot: string | null
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string
          customer_location_id: string | null
          customer_po_number_snapshot: string
          dropship_fee_amount: number
          freight_shipment_id: string | null
          id: string
          invoice_generation_status_snapshot: Database["public"]["Enums"]["invoice_generation_status"]
          invoice_required: boolean
          is_dropship: boolean
          notes: string | null
          packed_by_user_id: string | null
          packing_list_number: string
          sales_order_id: string
          sales_order_number_snapshot: string | null
          ship_date: string | null
          ship_to_hash: string | null
          ship_to_snapshot_json: Json
          ship_to_type: Database["public"]["Enums"]["sales_order_ship_to_type"]
          shipping_fee: number
          shipping_type_snapshot:
            | Database["public"]["Enums"]["shipping_type"]
            | null
          status: Database["public"]["Enums"]["packing_list_status"]
          tracking_number: string | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          allocated_freight_cost?: number
          carrier_snapshot?: string | null
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id: string
          customer_location_id?: string | null
          customer_po_number_snapshot: string
          dropship_fee_amount?: number
          freight_shipment_id?: string | null
          id?: string
          invoice_generation_status_snapshot?: Database["public"]["Enums"]["invoice_generation_status"]
          invoice_required?: boolean
          is_dropship?: boolean
          notes?: string | null
          packed_by_user_id?: string | null
          packing_list_number?: string
          sales_order_id: string
          sales_order_number_snapshot?: string | null
          ship_date?: string | null
          ship_to_hash?: string | null
          ship_to_snapshot_json: Json
          ship_to_type: Database["public"]["Enums"]["sales_order_ship_to_type"]
          shipping_fee?: number
          shipping_type_snapshot?:
            | Database["public"]["Enums"]["shipping_type"]
            | null
          status?: Database["public"]["Enums"]["packing_list_status"]
          tracking_number?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          allocated_freight_cost?: number
          carrier_snapshot?: string | null
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string
          customer_location_id?: string | null
          customer_po_number_snapshot?: string
          dropship_fee_amount?: number
          freight_shipment_id?: string | null
          id?: string
          invoice_generation_status_snapshot?: Database["public"]["Enums"]["invoice_generation_status"]
          invoice_required?: boolean
          is_dropship?: boolean
          notes?: string | null
          packed_by_user_id?: string | null
          packing_list_number?: string
          sales_order_id?: string
          sales_order_number_snapshot?: string | null
          ship_date?: string | null
          ship_to_hash?: string | null
          ship_to_snapshot_json?: Json
          ship_to_type?: Database["public"]["Enums"]["sales_order_ship_to_type"]
          shipping_fee?: number
          shipping_type_snapshot?:
            | Database["public"]["Enums"]["shipping_type"]
            | null
          status?: Database["public"]["Enums"]["packing_list_status"]
          tracking_number?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packing_list_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "packing_list_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_freight_shipment_id_fkey"
            columns: ["freight_shipment_id"]
            isOneToOne: false
            referencedRelation: "freight_shipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_packed_by_user_id_fkey"
            columns: ["packed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_packed_by_user_id_fkey"
            columns: ["packed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "packing_list_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
          {
            foreignKeyName: "packing_list_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      packing_list_line: {
        Row: {
          brand_id_snapshot: string
          brand_name_snapshot: string
          created_at: string
          created_by_user_id: string | null
          discount_percent_snapshot: number
          id: string
          line_total: number | null
          notes: string | null
          packing_list_id: string
          product_id: string
          product_name_snapshot: string
          product_sku_snapshot: string
          quantity_ordered_snapshot: number
          quantity_previously_shipped_snapshot: number
          quantity_shipped: number
          sales_order_line_id: string
          unit_price_snapshot: number
          updated_at: string
          updated_by_user_id: string | null
          warehouse_id: string | null
          warehouse_location_id: string | null
        }
        Insert: {
          brand_id_snapshot: string
          brand_name_snapshot: string
          created_at?: string
          created_by_user_id?: string | null
          discount_percent_snapshot?: number
          id?: string
          line_total?: number | null
          notes?: string | null
          packing_list_id: string
          product_id: string
          product_name_snapshot: string
          product_sku_snapshot: string
          quantity_ordered_snapshot: number
          quantity_previously_shipped_snapshot?: number
          quantity_shipped: number
          sales_order_line_id: string
          unit_price_snapshot: number
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id?: string | null
          warehouse_location_id?: string | null
        }
        Update: {
          brand_id_snapshot?: string
          brand_name_snapshot?: string
          created_at?: string
          created_by_user_id?: string | null
          discount_percent_snapshot?: number
          id?: string
          line_total?: number | null
          notes?: string | null
          packing_list_id?: string
          product_id?: string
          product_name_snapshot?: string
          product_sku_snapshot?: string
          quantity_ordered_snapshot?: number
          quantity_previously_shipped_snapshot?: number
          quantity_shipped?: number
          sales_order_line_id?: string
          unit_price_snapshot?: number
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id?: string | null
          warehouse_location_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packing_list_line_brand_id_snapshot_fkey"
            columns: ["brand_id_snapshot"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "packing_list_line_packing_list_id_fkey"
            columns: ["packing_list_id"]
            isOneToOne: false
            referencedRelation: "packing_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "packing_list_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "packing_list_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "packing_list_line_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "rga_available_sales_order_lines"
            referencedColumns: ["sales_order_line_id"]
          },
          {
            foreignKeyName: "packing_list_line_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "sales_order_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "packing_list_line_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_warehouse_location_id_fkey"
            columns: ["warehouse_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
        ]
      }
      packing_list_line_box: {
        Row: {
          box_height_snapshot: number | null
          box_label_snapshot: string | null
          box_length_snapshot: number | null
          box_quantity_shipped: number
          box_sequence_snapshot: number
          box_width_snapshot: number | null
          created_at: string
          gross_weight_snapshot: number | null
          id: string
          inventory_balance_id: string | null
          inventory_movement_id: string | null
          net_weight_snapshot: number | null
          packing_list_line_id: string
          product_id: string
          product_packing_box_id: string | null
          warehouse_id: string
          warehouse_location_id: string
        }
        Insert: {
          box_height_snapshot?: number | null
          box_label_snapshot?: string | null
          box_length_snapshot?: number | null
          box_quantity_shipped: number
          box_sequence_snapshot: number
          box_width_snapshot?: number | null
          created_at?: string
          gross_weight_snapshot?: number | null
          id?: string
          inventory_balance_id?: string | null
          inventory_movement_id?: string | null
          net_weight_snapshot?: number | null
          packing_list_line_id: string
          product_id: string
          product_packing_box_id: string | null
          warehouse_id: string
          warehouse_location_id: string
        }
        Update: {
          box_height_snapshot?: number | null
          box_label_snapshot?: string | null
          box_length_snapshot?: number | null
          box_quantity_shipped?: number
          box_sequence_snapshot?: number
          box_width_snapshot?: number | null
          created_at?: string
          gross_weight_snapshot?: number | null
          id?: string
          inventory_balance_id?: string | null
          inventory_movement_id?: string | null
          net_weight_snapshot?: number | null
          packing_list_line_id?: string
          product_id?: string
          product_packing_box_id?: string | null
          warehouse_id?: string
          warehouse_location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "packing_list_line_box_inventory_balance_id_fkey"
            columns: ["inventory_balance_id"]
            isOneToOne: false
            referencedRelation: "inventory_balance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_box_inventory_movement_id_fkey"
            columns: ["inventory_movement_id"]
            isOneToOne: false
            referencedRelation: "inventory_movement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_box_packing_list_line_id_fkey"
            columns: ["packing_list_line_id"]
            isOneToOne: false
            referencedRelation: "packing_list_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_box_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "packing_list_line_box_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_box_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "packing_list_line_box_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "packing_list_line_box_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_packing_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_box_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_packing_box_id"]
          },
          {
            foreignKeyName: "packing_list_line_box_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packing_list_line_box_warehouse_location_id_fkey"
            columns: ["warehouse_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_product_datasheet_export_run: {
        Row: {
          completed_at: string | null
          created_at: string
          export_status: Database["public"]["Enums"]["report_export_status"]
          filters_json: Json
          generated_file_id: string | null
          id: string
          output_format: Database["public"]["Enums"]["report_output_format"]
          partner_product_datasheet_template_id: string
          product_count: number
          report_export_run_id: string | null
          requested_by_user_id: string | null
          started_at: string | null
          validation_messages_json: Json
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          export_status?: Database["public"]["Enums"]["report_export_status"]
          filters_json?: Json
          generated_file_id?: string | null
          id?: string
          output_format: Database["public"]["Enums"]["report_output_format"]
          partner_product_datasheet_template_id: string
          product_count?: number
          report_export_run_id?: string | null
          requested_by_user_id?: string | null
          started_at?: string | null
          validation_messages_json?: Json
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          export_status?: Database["public"]["Enums"]["report_export_status"]
          filters_json?: Json
          generated_file_id?: string | null
          id?: string
          output_format?: Database["public"]["Enums"]["report_output_format"]
          partner_product_datasheet_template_id?: string
          product_count?: number
          report_export_run_id?: string | null
          requested_by_user_id?: string | null
          started_at?: string | null
          validation_messages_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "partner_product_datasheet_exp_partner_product_datasheet_te_fkey"
            columns: ["partner_product_datasheet_template_id"]
            isOneToOne: false
            referencedRelation: "partner_product_datasheet_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_product_datasheet_export_run_generated_file_id_fkey"
            columns: ["generated_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_product_datasheet_export_run_report_export_run_id_fkey"
            columns: ["report_export_run_id"]
            isOneToOne: false
            referencedRelation: "report_export_run"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_product_datasheet_export_run_requested_by_user_id_fkey"
            columns: ["requested_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_product_datasheet_export_run_requested_by_user_id_fkey"
            columns: ["requested_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      partner_product_datasheet_template: {
        Row: {
          approved_export_aliases_json: Json | null
          created_at: string
          created_by_user_id: string | null
          file_format: Database["public"]["Enums"]["partner_datasheet_file_format"]
          header_mapping_rule: string
          id: string
          is_active: boolean
          is_default: boolean
          partner_name: string
          template_code: string
          template_file_id: string | null
          template_file_name: string
          template_file_path: string | null
          template_name: string
          updated_at: string
          updated_by_user_id: string | null
          version_label: string | null
        }
        Insert: {
          approved_export_aliases_json?: Json | null
          created_at?: string
          created_by_user_id?: string | null
          file_format: Database["public"]["Enums"]["partner_datasheet_file_format"]
          header_mapping_rule?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          partner_name: string
          template_code: string
          template_file_id?: string | null
          template_file_name: string
          template_file_path?: string | null
          template_name: string
          updated_at?: string
          updated_by_user_id?: string | null
          version_label?: string | null
        }
        Update: {
          approved_export_aliases_json?: Json | null
          created_at?: string
          created_by_user_id?: string | null
          file_format?: Database["public"]["Enums"]["partner_datasheet_file_format"]
          header_mapping_rule?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          partner_name?: string
          template_code?: string
          template_file_id?: string | null
          template_file_name?: string
          template_file_path?: string | null
          template_name?: string
          updated_at?: string
          updated_by_user_id?: string | null
          version_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_product_datasheet_template_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_product_datasheet_template_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "partner_product_datasheet_template_template_file_id_fkey"
            columns: ["template_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_product_datasheet_template_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_product_datasheet_template_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payment_reminder: {
        Row: {
          brand_id: string
          created_at: string
          customer_account_id: string
          email_send_history_id: string | null
          id: string
          invoice_ids_json: Json
          notes: string | null
          reminder_date: string
          reminder_number: string
          sent_at: string | null
          sent_by_user_id: string | null
          status: Database["public"]["Enums"]["payment_reminder_status"]
          total_open_amount: number
          total_overdue_amount: number
        }
        Insert: {
          brand_id: string
          created_at?: string
          customer_account_id: string
          email_send_history_id?: string | null
          id?: string
          invoice_ids_json?: Json
          notes?: string | null
          reminder_date?: string
          reminder_number: string
          sent_at?: string | null
          sent_by_user_id?: string | null
          status?: Database["public"]["Enums"]["payment_reminder_status"]
          total_open_amount?: number
          total_overdue_amount?: number
        }
        Update: {
          brand_id?: string
          created_at?: string
          customer_account_id?: string
          email_send_history_id?: string | null
          id?: string
          invoice_ids_json?: Json
          notes?: string | null
          reminder_date?: string
          reminder_number?: string
          sent_at?: string | null
          sent_by_user_id?: string | null
          status?: Database["public"]["Enums"]["payment_reminder_status"]
          total_open_amount?: number
          total_overdue_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminder_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminder_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminder_email_send_history_id_fkey"
            columns: ["email_send_history_id"]
            isOneToOne: false
            referencedRelation: "email_send_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminder_sent_by_user_id_fkey"
            columns: ["sent_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminder_sent_by_user_id_fkey"
            columns: ["sent_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      permission: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_sensitive: boolean
          name: string
          permission_action: string
          permission_area: string
          permission_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_sensitive?: boolean
          name: string
          permission_action: string
          permission_area: string
          permission_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_sensitive?: boolean
          name?: string
          permission_action?: string
          permission_area?: string
          permission_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      primary_showroom_enrollment: {
        Row: {
          agreement_attachment_id: string | null
          approved_by_user_id: string | null
          approved_date: string | null
          created_at: string
          created_by_user_id: string | null
          current_display_count: number
          customer_account_id: string
          customer_location_id: string
          discount_percent: number
          enrollment_date: string
          expiration_date: string | null
          free_freight_threshold: number | null
          id: string
          last_review_date: string | null
          notes: string | null
          pending_renew_date: string | null
          program_status: Database["public"]["Enums"]["primary_showroom_status"]
          renewal_date: string | null
          renewal_notice_days_snapshot: number | null
          renewal_notification_email_history_id: string | null
          renewal_notification_sent_at: string | null
          required_display_count: number
          showroom_notification_email: string | null
          showroom_size_classification: string | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          agreement_attachment_id?: string | null
          approved_by_user_id?: string | null
          approved_date?: string | null
          created_at?: string
          created_by_user_id?: string | null
          current_display_count?: number
          customer_account_id: string
          customer_location_id: string
          discount_percent?: number
          enrollment_date?: string
          expiration_date?: string | null
          free_freight_threshold?: number | null
          id?: string
          last_review_date?: string | null
          notes?: string | null
          pending_renew_date?: string | null
          program_status?: Database["public"]["Enums"]["primary_showroom_status"]
          renewal_date?: string | null
          renewal_notice_days_snapshot?: number | null
          renewal_notification_email_history_id?: string | null
          renewal_notification_sent_at?: string | null
          required_display_count?: number
          showroom_notification_email?: string | null
          showroom_size_classification?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          agreement_attachment_id?: string | null
          approved_by_user_id?: string | null
          approved_date?: string | null
          created_at?: string
          created_by_user_id?: string | null
          current_display_count?: number
          customer_account_id?: string
          customer_location_id?: string
          discount_percent?: number
          enrollment_date?: string
          expiration_date?: string | null
          free_freight_threshold?: number | null
          id?: string
          last_review_date?: string | null
          notes?: string | null
          pending_renew_date?: string | null
          program_status?: Database["public"]["Enums"]["primary_showroom_status"]
          renewal_date?: string | null
          renewal_notice_days_snapshot?: number | null
          renewal_notification_email_history_id?: string | null
          renewal_notification_sent_at?: string | null
          required_display_count?: number
          showroom_notification_email?: string | null
          showroom_size_classification?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "primary_showroom_enrollment_agreement_attachment_id_fkey"
            columns: ["agreement_attachment_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "primary_showroom_enrollment_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "primary_showroom_enrollment_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "primary_showroom_enrollment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "primary_showroom_enrollment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "primary_showroom_enrollment_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "primary_showroom_enrollment_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "primary_showroom_enrollment_renewal_notification_email_his_fkey"
            columns: ["renewal_notification_email_history_id"]
            isOneToOne: false
            referencedRelation: "email_send_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "primary_showroom_enrollment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "primary_showroom_enrollment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product: {
        Row: {
          brand_id: string
          collection: string | null
          counts_toward_primary_showroom_default: boolean | null
          created_at: string
          created_by_user_id: string | null
          currency: string
          customer_eligibility_tag: Database["public"]["Enums"]["product_customer_eligibility_tag"]
          default_price: number | null
          default_vendor_id: string | null
          default_vendor_item_number: string | null
          description: string | null
          description_last_reviewed_at: string | null
          description_last_reviewed_by_user_id: string | null
          description_word_count: number | null
          id: string
          legacy_product_id: string | null
          name: string
          no_box_needed: boolean
          notes: string | null
          primary_showroom_exclusion_reason: string | null
          product_category_id: string | null
          sellability_status: Database["public"]["Enums"]["product_sellability_status"]
          signature_suite_id: string | null
          sku: string
          status: Database["public"]["Enums"]["product_lifecycle_status"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          brand_id: string
          collection?: string | null
          counts_toward_primary_showroom_default?: boolean | null
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          customer_eligibility_tag?: Database["public"]["Enums"]["product_customer_eligibility_tag"]
          default_price?: number | null
          default_vendor_id?: string | null
          default_vendor_item_number?: string | null
          description?: string | null
          description_last_reviewed_at?: string | null
          description_last_reviewed_by_user_id?: string | null
          description_word_count?: number | null
          id?: string
          legacy_product_id?: string | null
          name: string
          no_box_needed?: boolean
          notes?: string | null
          primary_showroom_exclusion_reason?: string | null
          product_category_id?: string | null
          sellability_status?: Database["public"]["Enums"]["product_sellability_status"]
          signature_suite_id?: string | null
          sku: string
          status?: Database["public"]["Enums"]["product_lifecycle_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          brand_id?: string
          collection?: string | null
          counts_toward_primary_showroom_default?: boolean | null
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          customer_eligibility_tag?: Database["public"]["Enums"]["product_customer_eligibility_tag"]
          default_price?: number | null
          default_vendor_id?: string | null
          default_vendor_item_number?: string | null
          description?: string | null
          description_last_reviewed_at?: string | null
          description_last_reviewed_by_user_id?: string | null
          description_word_count?: number | null
          id?: string
          legacy_product_id?: string | null
          name?: string
          no_box_needed?: boolean
          notes?: string | null
          primary_showroom_exclusion_reason?: string | null
          product_category_id?: string | null
          sellability_status?: Database["public"]["Enums"]["product_sellability_status"]
          signature_suite_id?: string | null
          sku?: string
          status?: Database["public"]["Enums"]["product_lifecycle_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_default_vendor_fkey"
            columns: ["default_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_description_last_reviewed_by_user_id_fkey"
            columns: ["description_last_reviewed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_description_last_reviewed_by_user_id_fkey"
            columns: ["description_last_reviewed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_product_category_id_fkey"
            columns: ["product_category_id"]
            isOneToOne: false
            referencedRelation: "product_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_signature_suite_id_fkey"
            columns: ["signature_suite_id"]
            isOneToOne: false
            referencedRelation: "product_signature_suite"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_category: {
        Row: {
          category_code: string
          counts_toward_primary_showroom_default: boolean
          created_at: string
          created_by_user_id: string | null
          id: string
          is_active: boolean
          name: string
          parent_category_id: string | null
          primary_showroom_exclusion_reason: string | null
          sort_order: number
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          category_code: string
          counts_toward_primary_showroom_default?: boolean
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_category_id?: string | null
          primary_showroom_exclusion_reason?: string | null
          sort_order?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          category_code?: string
          counts_toward_primary_showroom_default?: boolean
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_category_id?: string | null
          primary_showroom_exclusion_reason?: string | null
          sort_order?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_category_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_category_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "product_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_customer_eligibility: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string | null
          customer_location_id: string | null
          eligibility_type: Database["public"]["Enums"]["product_eligibility_rule_type"]
          end_date: string | null
          id: string
          is_active: boolean
          product_id: string
          reason: string | null
          start_date: string | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string | null
          customer_location_id?: string | null
          eligibility_type: Database["public"]["Enums"]["product_eligibility_rule_type"]
          end_date?: string | null
          id?: string
          is_active?: boolean
          product_id: string
          reason?: string | null
          start_date?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string | null
          customer_location_id?: string | null
          eligibility_type?: Database["public"]["Enums"]["product_eligibility_rule_type"]
          end_date?: string | null
          id?: string
          is_active?: boolean
          product_id?: string
          reason?: string | null
          start_date?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_customer_eligibility_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_customer_eligibility_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_customer_eligibility_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_customer_eligibility_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_customer_eligibility_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_customer_eligibility_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_customer_eligibility_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_customer_eligibility_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_customer_eligibility_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_customer_eligibility_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_document: {
        Row: {
          created_at: string
          deleted_at: string | null
          deleted_by_user_id: string | null
          display_name: string | null
          document_type: Database["public"]["Enums"]["product_document_type"]
          file_id: string
          id: string
          is_active: boolean
          product_id: string
          sort_order: number
          updated_at: string
          uploaded_at: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          display_name?: string | null
          document_type?: Database["public"]["Enums"]["product_document_type"]
          file_id: string
          id?: string
          is_active?: boolean
          product_id: string
          sort_order?: number
          updated_at?: string
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          display_name?: string | null
          document_type?: Database["public"]["Enums"]["product_document_type"]
          file_id?: string
          id?: string
          is_active?: boolean
          product_id?: string
          sort_order?: number
          updated_at?: string
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_document_deleted_by_user_id_fkey"
            columns: ["deleted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_document_deleted_by_user_id_fkey"
            columns: ["deleted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_document_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_document_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_document_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_document_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_document_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_document_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_document_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_finish: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          finish_id: string
          id: string
          is_active: boolean
          product_id: string
          sort_order: number
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          finish_id: string
          id?: string
          is_active?: boolean
          product_id: string
          sort_order?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          finish_id?: string
          id?: string
          is_active?: boolean
          product_id?: string
          sort_order?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_finish_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_finish_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_finish_finish_id_fkey"
            columns: ["finish_id"]
            isOneToOne: false
            referencedRelation: "finish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_finish_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_finish_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_finish_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_finish_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_finish_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_finish_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_hanging_config: {
        Row: {
          canopy_detail: string | null
          chain_length: string | null
          created_at: string
          created_by_user_id: string | null
          id: string
          is_active: boolean
          mounting_type: string | null
          notes: string | null
          product_id: string
          rod_length: string | null
          updated_at: string
          updated_by_user_id: string | null
          wire_length: string | null
        }
        Insert: {
          canopy_detail?: string | null
          chain_length?: string | null
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          mounting_type?: string | null
          notes?: string | null
          product_id: string
          rod_length?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          wire_length?: string | null
        }
        Update: {
          canopy_detail?: string | null
          chain_length?: string | null
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          mounting_type?: string | null
          notes?: string | null
          product_id?: string
          rod_length?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          wire_length?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_hanging_config_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_hanging_config_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_hanging_config_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_hanging_config_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_hanging_config_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_hanging_config_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_hanging_config_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_hanging_config_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_image: {
        Row: {
          created_at: string
          deleted_at: string | null
          deleted_by_user_id: string | null
          display_name: string | null
          file_id: string
          id: string
          image_category: Database["public"]["Enums"]["product_image_category"]
          is_active: boolean
          is_default_thumbnail: boolean
          product_id: string
          sort_order: number
          updated_at: string
          uploaded_at: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          display_name?: string | null
          file_id: string
          id?: string
          image_category?: Database["public"]["Enums"]["product_image_category"]
          is_active?: boolean
          is_default_thumbnail?: boolean
          product_id: string
          sort_order?: number
          updated_at?: string
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          display_name?: string | null
          file_id?: string
          id?: string
          image_category?: Database["public"]["Enums"]["product_image_category"]
          is_active?: boolean
          is_default_thumbnail?: boolean
          product_id?: string
          sort_order?: number
          updated_at?: string
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_image_deleted_by_user_id_fkey"
            columns: ["deleted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_image_deleted_by_user_id_fkey"
            columns: ["deleted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_image_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_image_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_image_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_image_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_image_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_image_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_image_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_packing_box: {
        Row: {
          box_height: number | null
          box_label: string | null
          box_length: number | null
          box_sequence: number
          box_width: number | null
          cbm: number | null
          created_at: string
          created_by_user_id: string | null
          default_warehouse_id: string | null
          default_warehouse_location_id: string | null
          gross_weight: number | null
          id: string
          inch_volume: number | null
          is_active: boolean
          is_required_for_sale: boolean
          net_weight: number | null
          notes: string | null
          pallet_quantity: number | null
          product_id: string
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          box_height?: number | null
          box_label?: string | null
          box_length?: number | null
          box_sequence: number
          box_width?: number | null
          cbm?: number | null
          created_at?: string
          created_by_user_id?: string | null
          default_warehouse_id?: string | null
          default_warehouse_location_id?: string | null
          gross_weight?: number | null
          id?: string
          inch_volume?: number | null
          is_active?: boolean
          is_required_for_sale?: boolean
          net_weight?: number | null
          notes?: string | null
          pallet_quantity?: number | null
          product_id: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          box_height?: number | null
          box_label?: string | null
          box_length?: number | null
          box_sequence?: number
          box_width?: number | null
          cbm?: number | null
          created_at?: string
          created_by_user_id?: string | null
          default_warehouse_id?: string | null
          default_warehouse_location_id?: string | null
          gross_weight?: number | null
          id?: string
          inch_volume?: number | null
          is_active?: boolean
          is_required_for_sale?: boolean
          net_weight?: number | null
          notes?: string | null
          pallet_quantity?: number | null
          product_id?: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_packing_box_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_packing_box_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_packing_box_default_location_fkey"
            columns: ["default_warehouse_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_packing_box_default_warehouse_fkey"
            columns: ["default_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_packing_box_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_packing_box_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_packing_box_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_packing_box_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_packing_box_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_packing_box_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_part: {
        Row: {
          component_product_id: string
          created_at: string
          created_by_user_id: string | null
          id: string
          is_active: boolean
          is_required: boolean
          notes: string | null
          parent_product_id: string
          part_name: string | null
          part_role: string | null
          quantity_required: number
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          component_product_id: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          notes?: string | null
          parent_product_id: string
          part_name?: string | null
          part_role?: string | null
          quantity_required?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          component_product_id?: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          notes?: string | null
          parent_product_id?: string
          part_name?: string | null
          part_role?: string | null
          quantity_required?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_part_component_product_id_fkey"
            columns: ["component_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_part_component_product_id_fkey"
            columns: ["component_product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_part_component_product_id_fkey"
            columns: ["component_product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_part_component_product_id_fkey"
            columns: ["component_product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_part_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_part_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_part_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_part_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_part_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_part_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_part_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_part_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_signature_suite: {
        Row: {
          brand_id: string | null
          created_at: string
          created_by_user_id: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          suite_code: string
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          suite_code: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          suite_code?: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_signature_suite_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_signature_suite_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_signature_suite_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_signature_suite_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_signature_suite_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_spec_attribute: {
        Row: {
          attribute_name: string
          attribute_value: string
          created_at: string
          created_by_user_id: string | null
          id: string
          is_active: boolean
          product_id: string
          sort_order: number
          unit: string | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          attribute_name: string
          attribute_value: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          product_id: string
          sort_order?: number
          unit?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          attribute_name?: string
          attribute_value?: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          product_id?: string
          sort_order?: number
          unit?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_spec_attribute_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_spec_attribute_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_spec_attribute_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_spec_attribute_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_spec_attribute_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_spec_attribute_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_spec_attribute_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_spec_attribute_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      qa_defect: {
        Row: {
          assigned_to_user_id: string | null
          closed_at: string | null
          defect_number: string
          description: string | null
          id: string
          module_area: string
          owner_approved_workaround: boolean
          reported_at: string
          reported_by_user_id: string | null
          severity: Database["public"]["Enums"]["defect_severity"]
          status: Database["public"]["Enums"]["defect_status"]
          title: string
          workaround: string | null
        }
        Insert: {
          assigned_to_user_id?: string | null
          closed_at?: string | null
          defect_number: string
          description?: string | null
          id?: string
          module_area: string
          owner_approved_workaround?: boolean
          reported_at?: string
          reported_by_user_id?: string | null
          severity: Database["public"]["Enums"]["defect_severity"]
          status?: Database["public"]["Enums"]["defect_status"]
          title: string
          workaround?: string | null
        }
        Update: {
          assigned_to_user_id?: string | null
          closed_at?: string | null
          defect_number?: string
          description?: string | null
          id?: string
          module_area?: string
          owner_approved_workaround?: boolean
          reported_at?: string
          reported_by_user_id?: string | null
          severity?: Database["public"]["Enums"]["defect_severity"]
          status?: Database["public"]["Enums"]["defect_status"]
          title?: string
          workaround?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qa_defect_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_defect_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "qa_defect_reported_by_user_id_fkey"
            columns: ["reported_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_defect_reported_by_user_id_fkey"
            columns: ["reported_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      receiving_record: {
        Row: {
          cancelled_at: string | null
          created_at: string
          created_by_user_id: string | null
          id: string
          notes: string | null
          posted_at: string | null
          received_by_user_id: string | null
          received_date: string
          receiving_number: string
          source_id: string
          source_type: Database["public"]["Enums"]["receiving_source_type"]
          status: Database["public"]["Enums"]["receiving_status"]
          updated_at: string
          updated_by_user_id: string | null
          warehouse_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          notes?: string | null
          posted_at?: string | null
          received_by_user_id?: string | null
          received_date?: string
          receiving_number?: string
          source_id: string
          source_type: Database["public"]["Enums"]["receiving_source_type"]
          status?: Database["public"]["Enums"]["receiving_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          notes?: string | null
          posted_at?: string | null
          received_by_user_id?: string | null
          received_date?: string
          receiving_number?: string
          source_id?: string
          source_type?: Database["public"]["Enums"]["receiving_source_type"]
          status?: Database["public"]["Enums"]["receiving_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receiving_record_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiving_record_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "receiving_record_received_by_user_id_fkey"
            columns: ["received_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiving_record_received_by_user_id_fkey"
            columns: ["received_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "receiving_record_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiving_record_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "receiving_record_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
        ]
      }
      receiving_record_line: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          id: string
          inventory_condition: Database["public"]["Enums"]["inventory_condition"]
          inventory_movement_id: string | null
          notes: string | null
          product_id: string
          product_packing_box_id: string | null
          quantity_received: number
          receiving_record_id: string
          source_line_id: string
          source_line_type: Database["public"]["Enums"]["receiving_line_source_type"]
          updated_at: string
          updated_by_user_id: string | null
          warehouse_location_id: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          inventory_movement_id?: string | null
          notes?: string | null
          product_id: string
          product_packing_box_id?: string | null
          quantity_received: number
          receiving_record_id: string
          source_line_id: string
          source_line_type: Database["public"]["Enums"]["receiving_line_source_type"]
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_location_id: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          inventory_movement_id?: string | null
          notes?: string | null
          product_id?: string
          product_packing_box_id?: string | null
          quantity_received?: number
          receiving_record_id?: string
          source_line_id?: string
          source_line_type?: Database["public"]["Enums"]["receiving_line_source_type"]
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receiving_record_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiving_record_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "receiving_record_line_inventory_movement_id_fkey"
            columns: ["inventory_movement_id"]
            isOneToOne: false
            referencedRelation: "inventory_movement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiving_record_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "receiving_record_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiving_record_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "receiving_record_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "receiving_record_line_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_packing_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiving_record_line_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_packing_box_id"]
          },
          {
            foreignKeyName: "receiving_record_line_receiving_record_id_fkey"
            columns: ["receiving_record_id"]
            isOneToOne: false
            referencedRelation: "receiving_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiving_record_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiving_record_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "receiving_record_line_warehouse_location_id_fkey"
            columns: ["warehouse_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
        ]
      }
      report_definition: {
        Row: {
          available_columns_json: Json
          available_filters_json: Json
          created_at: string
          created_by_user_id: string | null
          default_columns_json: Json
          default_filters_json: Json
          description: string | null
          id: string
          is_active: boolean
          is_external_safe: boolean
          name: string
          permission_code: string | null
          report_code: string
          report_type: Database["public"]["Enums"]["report_type"]
          supported_output_formats: Database["public"]["Enums"]["report_output_format"][]
          supports_brand_filter: boolean
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          available_columns_json?: Json
          available_filters_json?: Json
          created_at?: string
          created_by_user_id?: string | null
          default_columns_json?: Json
          default_filters_json?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          is_external_safe?: boolean
          name: string
          permission_code?: string | null
          report_code: string
          report_type: Database["public"]["Enums"]["report_type"]
          supported_output_formats?: Database["public"]["Enums"]["report_output_format"][]
          supports_brand_filter?: boolean
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          available_columns_json?: Json
          available_filters_json?: Json
          created_at?: string
          created_by_user_id?: string | null
          default_columns_json?: Json
          default_filters_json?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          is_external_safe?: boolean
          name?: string
          permission_code?: string | null
          report_code?: string
          report_type?: Database["public"]["Enums"]["report_type"]
          supported_output_formats?: Database["public"]["Enums"]["report_output_format"][]
          supports_brand_filter?: boolean
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_definition_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_definition_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "report_definition_permission_code_fkey"
            columns: ["permission_code"]
            isOneToOne: false
            referencedRelation: "active_permission_overrides"
            referencedColumns: ["permission_code"]
          },
          {
            foreignKeyName: "report_definition_permission_code_fkey"
            columns: ["permission_code"]
            isOneToOne: false
            referencedRelation: "permission"
            referencedColumns: ["permission_code"]
          },
          {
            foreignKeyName: "report_definition_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_definition_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      report_export_run: {
        Row: {
          brand_filter_id: string | null
          completed_at: string | null
          created_at: string
          customer_account_id: string | null
          customer_location_id: string | null
          error_message: string | null
          export_status: Database["public"]["Enums"]["report_export_status"]
          generated_document_event_id: string | null
          generated_file_id: string | null
          id: string
          record_count: number | null
          report_definition_id: string
          requested_by_user_id: string | null
          requested_filters_json: Json
          requested_output_format: Database["public"]["Enums"]["report_output_format"]
          saved_report_configuration_id: string | null
          selected_columns_json: Json
          started_at: string | null
        }
        Insert: {
          brand_filter_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_account_id?: string | null
          customer_location_id?: string | null
          error_message?: string | null
          export_status?: Database["public"]["Enums"]["report_export_status"]
          generated_document_event_id?: string | null
          generated_file_id?: string | null
          id?: string
          record_count?: number | null
          report_definition_id: string
          requested_by_user_id?: string | null
          requested_filters_json?: Json
          requested_output_format: Database["public"]["Enums"]["report_output_format"]
          saved_report_configuration_id?: string | null
          selected_columns_json?: Json
          started_at?: string | null
        }
        Update: {
          brand_filter_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_account_id?: string | null
          customer_location_id?: string | null
          error_message?: string | null
          export_status?: Database["public"]["Enums"]["report_export_status"]
          generated_document_event_id?: string | null
          generated_file_id?: string | null
          id?: string
          record_count?: number | null
          report_definition_id?: string
          requested_by_user_id?: string | null
          requested_filters_json?: Json
          requested_output_format?: Database["public"]["Enums"]["report_output_format"]
          saved_report_configuration_id?: string | null
          selected_columns_json?: Json
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_export_run_brand_filter_id_fkey"
            columns: ["brand_filter_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_export_run_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_export_run_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_export_run_generated_document_event_id_fkey"
            columns: ["generated_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_export_run_generated_document_event_id_fkey"
            columns: ["generated_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_export_run_generated_file_id_fkey"
            columns: ["generated_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_export_run_report_definition_id_fkey"
            columns: ["report_definition_id"]
            isOneToOne: false
            referencedRelation: "report_definition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_export_run_requested_by_user_id_fkey"
            columns: ["requested_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_export_run_requested_by_user_id_fkey"
            columns: ["requested_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "report_export_run_saved_report_configuration_id_fkey"
            columns: ["saved_report_configuration_id"]
            isOneToOne: false
            referencedRelation: "saved_report_configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      rga: {
        Row: {
          approval_email_send_history_id: string | null
          approval_email_to_snapshot: string | null
          approval_sheet_document_event_id: string | null
          approved_resolution_type:
            | Database["public"]["Enums"]["rga_resolution_type"]
            | null
          authorized_by_user_id: string | null
          authorized_date: string | null
          cancelled_at: string | null
          cancelled_by_user_id: string | null
          closed_date: string | null
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string
          customer_account_number_snapshot: string | null
          customer_images_received: boolean
          customer_invoice_id: string | null
          customer_location_id: string | null
          customer_name_snapshot: string
          customer_pays_return_freight: boolean
          defective_item_disposition: Database["public"]["Enums"]["rga_defective_item_disposition"]
          id: string
          issue_description: string | null
          legacy_account_id_snapshot: string | null
          order_contact_snapshot_json: Json | null
          original_customer_po_number_snapshot: string | null
          received_date: string | null
          rejected_at: string | null
          rejected_by_user_id: string | null
          request_date: string
          requested_resolution_type: Database["public"]["Enums"]["rga_resolution_type"]
          requires_customer_images: boolean
          resolution_notes: string | null
          return_required: boolean
          rga_number: string
          rga_reason_category: Database["public"]["Enums"]["rga_reason_category"]
          sales_order_id: string | null
          status: Database["public"]["Enums"]["rga_status"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          approval_email_send_history_id?: string | null
          approval_email_to_snapshot?: string | null
          approval_sheet_document_event_id?: string | null
          approved_resolution_type?:
            | Database["public"]["Enums"]["rga_resolution_type"]
            | null
          authorized_by_user_id?: string | null
          authorized_date?: string | null
          cancelled_at?: string | null
          cancelled_by_user_id?: string | null
          closed_date?: string | null
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id: string
          customer_account_number_snapshot?: string | null
          customer_images_received?: boolean
          customer_invoice_id?: string | null
          customer_location_id?: string | null
          customer_name_snapshot: string
          customer_pays_return_freight?: boolean
          defective_item_disposition?: Database["public"]["Enums"]["rga_defective_item_disposition"]
          id?: string
          issue_description?: string | null
          legacy_account_id_snapshot?: string | null
          order_contact_snapshot_json?: Json | null
          original_customer_po_number_snapshot?: string | null
          received_date?: string | null
          rejected_at?: string | null
          rejected_by_user_id?: string | null
          request_date?: string
          requested_resolution_type: Database["public"]["Enums"]["rga_resolution_type"]
          requires_customer_images?: boolean
          resolution_notes?: string | null
          return_required?: boolean
          rga_number?: string
          rga_reason_category: Database["public"]["Enums"]["rga_reason_category"]
          sales_order_id?: string | null
          status?: Database["public"]["Enums"]["rga_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          approval_email_send_history_id?: string | null
          approval_email_to_snapshot?: string | null
          approval_sheet_document_event_id?: string | null
          approved_resolution_type?:
            | Database["public"]["Enums"]["rga_resolution_type"]
            | null
          authorized_by_user_id?: string | null
          authorized_date?: string | null
          cancelled_at?: string | null
          cancelled_by_user_id?: string | null
          closed_date?: string | null
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string
          customer_account_number_snapshot?: string | null
          customer_images_received?: boolean
          customer_invoice_id?: string | null
          customer_location_id?: string | null
          customer_name_snapshot?: string
          customer_pays_return_freight?: boolean
          defective_item_disposition?: Database["public"]["Enums"]["rga_defective_item_disposition"]
          id?: string
          issue_description?: string | null
          legacy_account_id_snapshot?: string | null
          order_contact_snapshot_json?: Json | null
          original_customer_po_number_snapshot?: string | null
          received_date?: string | null
          rejected_at?: string | null
          rejected_by_user_id?: string | null
          request_date?: string
          requested_resolution_type?: Database["public"]["Enums"]["rga_resolution_type"]
          requires_customer_images?: boolean
          resolution_notes?: string | null
          return_required?: boolean
          rga_number?: string
          rga_reason_category?: Database["public"]["Enums"]["rga_reason_category"]
          sales_order_id?: string | null
          status?: Database["public"]["Enums"]["rga_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rga_approval_email_send_history_id_fkey"
            columns: ["approval_email_send_history_id"]
            isOneToOne: false
            referencedRelation: "email_send_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_approval_sheet_document_event_id_fkey"
            columns: ["approval_sheet_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_approval_sheet_document_event_id_fkey"
            columns: ["approval_sheet_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_authorized_by_user_id_fkey"
            columns: ["authorized_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_authorized_by_user_id_fkey"
            columns: ["authorized_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rga_cancelled_by_user_id_fkey"
            columns: ["cancelled_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_cancelled_by_user_id_fkey"
            columns: ["cancelled_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rga_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rga_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_rejected_by_user_id_fkey"
            columns: ["rejected_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_rejected_by_user_id_fkey"
            columns: ["rejected_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rga_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
          {
            foreignKeyName: "rga_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rga_line: {
        Row: {
          available_rga_quantity_snapshot: number
          brand_id_snapshot: string
          brand_name_snapshot: string
          created_at: string
          created_by_user_id: string | null
          credit_required: boolean
          customer_invoice_line_id: string | null
          defect_description: string | null
          field_demolish_proof_file_id: string | null
          field_demolish_required: boolean
          id: string
          inventory_disposition: Database["public"]["Enums"]["rga_inventory_disposition"]
          notes: string | null
          previous_rga_quantity_snapshot: number
          product_id: string
          product_name_snapshot: string
          product_sku_snapshot: string
          quantity_authorized: number
          quantity_credited: number
          quantity_received: number
          quantity_replaced: number
          quantity_requested: number
          quantity_shipped_snapshot: number
          received_condition: string | null
          received_inventory_condition: Database["public"]["Enums"]["inventory_condition"]
          replacement_required: boolean
          return_inventory_movement_id: string | null
          return_reason: string | null
          rga_id: string
          sales_order_line_id: string
          status: Database["public"]["Enums"]["rga_line_status"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          available_rga_quantity_snapshot: number
          brand_id_snapshot: string
          brand_name_snapshot: string
          created_at?: string
          created_by_user_id?: string | null
          credit_required?: boolean
          customer_invoice_line_id?: string | null
          defect_description?: string | null
          field_demolish_proof_file_id?: string | null
          field_demolish_required?: boolean
          id?: string
          inventory_disposition?: Database["public"]["Enums"]["rga_inventory_disposition"]
          notes?: string | null
          previous_rga_quantity_snapshot?: number
          product_id: string
          product_name_snapshot: string
          product_sku_snapshot: string
          quantity_authorized?: number
          quantity_credited?: number
          quantity_received?: number
          quantity_replaced?: number
          quantity_requested: number
          quantity_shipped_snapshot: number
          received_condition?: string | null
          received_inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          replacement_required?: boolean
          return_inventory_movement_id?: string | null
          return_reason?: string | null
          rga_id: string
          sales_order_line_id: string
          status?: Database["public"]["Enums"]["rga_line_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          available_rga_quantity_snapshot?: number
          brand_id_snapshot?: string
          brand_name_snapshot?: string
          created_at?: string
          created_by_user_id?: string | null
          credit_required?: boolean
          customer_invoice_line_id?: string | null
          defect_description?: string | null
          field_demolish_proof_file_id?: string | null
          field_demolish_required?: boolean
          id?: string
          inventory_disposition?: Database["public"]["Enums"]["rga_inventory_disposition"]
          notes?: string | null
          previous_rga_quantity_snapshot?: number
          product_id?: string
          product_name_snapshot?: string
          product_sku_snapshot?: string
          quantity_authorized?: number
          quantity_credited?: number
          quantity_received?: number
          quantity_replaced?: number
          quantity_requested?: number
          quantity_shipped_snapshot?: number
          received_condition?: string | null
          received_inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          replacement_required?: boolean
          return_inventory_movement_id?: string | null
          return_reason?: string | null
          rga_id?: string
          sales_order_line_id?: string
          status?: Database["public"]["Enums"]["rga_line_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rga_line_brand_id_snapshot_fkey"
            columns: ["brand_id_snapshot"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rga_line_customer_invoice_line_id_fkey"
            columns: ["customer_invoice_line_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_line_field_demolish_proof_file_id_fkey"
            columns: ["field_demolish_proof_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "rga_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "rga_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "rga_line_return_inventory_movement_id_fkey"
            columns: ["return_inventory_movement_id"]
            isOneToOne: false
            referencedRelation: "inventory_movement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_line_rga_id_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_line_rga_id_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga_dashboard_action_queue"
            referencedColumns: ["rga_id"]
          },
          {
            foreignKeyName: "rga_line_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "rga_available_sales_order_lines"
            referencedColumns: ["sales_order_line_id"]
          },
          {
            foreignKeyName: "rga_line_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "sales_order_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rga_policy: {
        Row: {
          allow_restocking_fee_override: boolean
          created_at: string
          created_by_user_id: string | null
          default_customer_pays_return_freight: boolean
          default_restocking_fee_percent: number
          default_return_inventory_condition: Database["public"]["Enums"]["inventory_condition"]
          id: string
          is_active: boolean
          notes: string | null
          policy_name: string
          requires_customer_images: boolean
          requires_inspection_before_credit: boolean
          requires_return: boolean
          rga_reason_category: Database["public"]["Enums"]["rga_reason_category"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          allow_restocking_fee_override?: boolean
          created_at?: string
          created_by_user_id?: string | null
          default_customer_pays_return_freight?: boolean
          default_restocking_fee_percent?: number
          default_return_inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          id?: string
          is_active?: boolean
          notes?: string | null
          policy_name: string
          requires_customer_images?: boolean
          requires_inspection_before_credit?: boolean
          requires_return?: boolean
          rga_reason_category: Database["public"]["Enums"]["rga_reason_category"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          allow_restocking_fee_override?: boolean
          created_at?: string
          created_by_user_id?: string | null
          default_customer_pays_return_freight?: boolean
          default_restocking_fee_percent?: number
          default_return_inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          id?: string
          is_active?: boolean
          notes?: string | null
          policy_name?: string
          requires_customer_images?: boolean
          requires_inspection_before_credit?: boolean
          requires_return?: boolean
          rga_reason_category?: Database["public"]["Enums"]["rga_reason_category"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rga_policy_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_policy_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rga_policy_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_policy_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rga_replacement_order: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          freight_charge_policy: Database["public"]["Enums"]["rga_replacement_freight_policy"]
          id: string
          packing_list_id: string | null
          replacement_customer_po_number_snapshot: string | null
          replacement_order_number_snapshot: string | null
          replacement_reason: string | null
          rga_id: string
          sales_order_id: string
          shipped_date: string | null
          status: Database["public"]["Enums"]["rga_replacement_order_status"]
          tracking_number: string | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          freight_charge_policy?: Database["public"]["Enums"]["rga_replacement_freight_policy"]
          id?: string
          packing_list_id?: string | null
          replacement_customer_po_number_snapshot?: string | null
          replacement_order_number_snapshot?: string | null
          replacement_reason?: string | null
          rga_id: string
          sales_order_id: string
          shipped_date?: string | null
          status?: Database["public"]["Enums"]["rga_replacement_order_status"]
          tracking_number?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          freight_charge_policy?: Database["public"]["Enums"]["rga_replacement_freight_policy"]
          id?: string
          packing_list_id?: string | null
          replacement_customer_po_number_snapshot?: string | null
          replacement_order_number_snapshot?: string | null
          replacement_reason?: string | null
          rga_id?: string
          sales_order_id?: string
          shipped_date?: string | null
          status?: Database["public"]["Enums"]["rga_replacement_order_status"]
          tracking_number?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rga_replacement_order_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_replacement_order_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rga_replacement_order_packing_list_id_fkey"
            columns: ["packing_list_id"]
            isOneToOne: false
            referencedRelation: "packing_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_replacement_order_rga_id_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_replacement_order_rga_id_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga_dashboard_action_queue"
            referencedColumns: ["rga_id"]
          },
          {
            foreignKeyName: "rga_replacement_order_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_replacement_order_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
          {
            foreignKeyName: "rga_replacement_order_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_replacement_order_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rga_status_history: {
        Row: {
          changed_at: string
          changed_by_user_id: string | null
          id: string
          new_status: Database["public"]["Enums"]["rga_status"]
          notes: string | null
          old_status: Database["public"]["Enums"]["rga_status"] | null
          reason: string | null
          rga_id: string
        }
        Insert: {
          changed_at?: string
          changed_by_user_id?: string | null
          id?: string
          new_status: Database["public"]["Enums"]["rga_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["rga_status"] | null
          reason?: string | null
          rga_id: string
        }
        Update: {
          changed_at?: string
          changed_by_user_id?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["rga_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["rga_status"] | null
          reason?: string | null
          rga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rga_status_history_changed_by_user_id_fkey"
            columns: ["changed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_status_history_changed_by_user_id_fkey"
            columns: ["changed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rga_status_history_rga_id_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_status_history_rga_id_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga_dashboard_action_queue"
            referencedColumns: ["rga_id"]
          },
        ]
      }
      role: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_system_role: boolean
          name: string
          role_code: string
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system_role?: boolean
          name: string
          role_code: string
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system_role?: boolean
          name?: string
          role_code?: string
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      role_permission: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          id: string
          permission_id: string
          permission_level: Database["public"]["Enums"]["permission_level"]
          role_id: string
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          permission_id: string
          permission_level?: Database["public"]["Enums"]["permission_level"]
          role_id: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          permission_id?: string
          permission_level?: Database["public"]["Enums"]["permission_level"]
          role_id?: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permission_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permission_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "role_permission_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permission_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permission_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permission_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sales_order: {
        Row: {
          acknowledgement_document_type: Database["public"]["Enums"]["sales_order_document_type"]
          balance_at_order_entry_snapshot: number | null
          bill_to_snapshot_json: Json | null
          closed_at: string | null
          converted_from_quote_id: string | null
          created_at: string
          created_by_user_id: string | null
          credit_hold_reason:
            | Database["public"]["Enums"]["credit_hold_reason"]
            | null
          credit_hold_status: Database["public"]["Enums"]["credit_hold_status"]
          credit_limit_snapshot: number | null
          currency: string
          customer_account_id: string
          customer_account_number_snapshot: string | null
          customer_location_id: string | null
          customer_name_snapshot: string
          customer_po_number: string
          deleted_at: string | null
          deleted_by_user_id: string | null
          discount_percent_snapshot: number
          display_order_type:
            | Database["public"]["Enums"]["display_order_type"]
            | null
          display_tracking_required: boolean
          dropship_fee_amount: number
          dropship_fee_override: boolean
          dropship_fee_override_reason: string | null
          freight_amount: number
          freight_review_required: boolean
          ground_carrier_account_number_snapshot: string | null
          ground_carrier_snapshot: string | null
          ground_freight_terms_snapshot: Database["public"]["Enums"]["freight_terms"]
          id: string
          invoice_required: boolean
          is_dropship: boolean
          legacy_account_id_snapshot: string | null
          ltl_carrier_account_number_snapshot: string | null
          ltl_carrier_snapshot: string | null
          ltl_freight_terms_snapshot: Database["public"]["Enums"]["freight_terms"]
          notes: string | null
          order_contact_snapshot_json: Json | null
          order_date: string
          order_source: Database["public"]["Enums"]["sales_order_source"]
          order_type: Database["public"]["Enums"]["sales_order_type"]
          payment_terms_snapshot: string | null
          primary_showroom_enrollment_id: string | null
          requested_ship_date: string | null
          rga_id: string | null
          sales_order_number: string
          sales_rep_agency_id_snapshot: string | null
          sales_rep_id_snapshot: string | null
          ship_to_display_name_snapshot: string
          ship_to_snapshot_json: Json
          ship_to_type: Database["public"]["Enums"]["sales_order_ship_to_type"]
          shipping_priority: Database["public"]["Enums"]["shipping_priority"]
          shipping_readiness_status: Database["public"]["Enums"]["shipping_readiness_status"]
          status: Database["public"]["Enums"]["sales_order_status"]
          subtotal_amount: number
          tax_amount: number
          territory_id_snapshot: string | null
          total_amount: number | null
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          acknowledgement_document_type?: Database["public"]["Enums"]["sales_order_document_type"]
          balance_at_order_entry_snapshot?: number | null
          bill_to_snapshot_json?: Json | null
          closed_at?: string | null
          converted_from_quote_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          credit_hold_reason?:
            | Database["public"]["Enums"]["credit_hold_reason"]
            | null
          credit_hold_status?: Database["public"]["Enums"]["credit_hold_status"]
          credit_limit_snapshot?: number | null
          currency?: string
          customer_account_id: string
          customer_account_number_snapshot?: string | null
          customer_location_id?: string | null
          customer_name_snapshot: string
          customer_po_number: string
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          discount_percent_snapshot?: number
          display_order_type?:
            | Database["public"]["Enums"]["display_order_type"]
            | null
          display_tracking_required?: boolean
          dropship_fee_amount?: number
          dropship_fee_override?: boolean
          dropship_fee_override_reason?: string | null
          freight_amount?: number
          freight_review_required?: boolean
          ground_carrier_account_number_snapshot?: string | null
          ground_carrier_snapshot?: string | null
          ground_freight_terms_snapshot?: Database["public"]["Enums"]["freight_terms"]
          id?: string
          invoice_required?: boolean
          is_dropship?: boolean
          legacy_account_id_snapshot?: string | null
          ltl_carrier_account_number_snapshot?: string | null
          ltl_carrier_snapshot?: string | null
          ltl_freight_terms_snapshot?: Database["public"]["Enums"]["freight_terms"]
          notes?: string | null
          order_contact_snapshot_json?: Json | null
          order_date?: string
          order_source?: Database["public"]["Enums"]["sales_order_source"]
          order_type?: Database["public"]["Enums"]["sales_order_type"]
          payment_terms_snapshot?: string | null
          primary_showroom_enrollment_id?: string | null
          requested_ship_date?: string | null
          rga_id?: string | null
          sales_order_number?: string
          sales_rep_agency_id_snapshot?: string | null
          sales_rep_id_snapshot?: string | null
          ship_to_display_name_snapshot: string
          ship_to_snapshot_json: Json
          ship_to_type?: Database["public"]["Enums"]["sales_order_ship_to_type"]
          shipping_priority?: Database["public"]["Enums"]["shipping_priority"]
          shipping_readiness_status?: Database["public"]["Enums"]["shipping_readiness_status"]
          status?: Database["public"]["Enums"]["sales_order_status"]
          subtotal_amount?: number
          tax_amount?: number
          territory_id_snapshot?: string | null
          total_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          acknowledgement_document_type?: Database["public"]["Enums"]["sales_order_document_type"]
          balance_at_order_entry_snapshot?: number | null
          bill_to_snapshot_json?: Json | null
          closed_at?: string | null
          converted_from_quote_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          credit_hold_reason?:
            | Database["public"]["Enums"]["credit_hold_reason"]
            | null
          credit_hold_status?: Database["public"]["Enums"]["credit_hold_status"]
          credit_limit_snapshot?: number | null
          currency?: string
          customer_account_id?: string
          customer_account_number_snapshot?: string | null
          customer_location_id?: string | null
          customer_name_snapshot?: string
          customer_po_number?: string
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          discount_percent_snapshot?: number
          display_order_type?:
            | Database["public"]["Enums"]["display_order_type"]
            | null
          display_tracking_required?: boolean
          dropship_fee_amount?: number
          dropship_fee_override?: boolean
          dropship_fee_override_reason?: string | null
          freight_amount?: number
          freight_review_required?: boolean
          ground_carrier_account_number_snapshot?: string | null
          ground_carrier_snapshot?: string | null
          ground_freight_terms_snapshot?: Database["public"]["Enums"]["freight_terms"]
          id?: string
          invoice_required?: boolean
          is_dropship?: boolean
          legacy_account_id_snapshot?: string | null
          ltl_carrier_account_number_snapshot?: string | null
          ltl_carrier_snapshot?: string | null
          ltl_freight_terms_snapshot?: Database["public"]["Enums"]["freight_terms"]
          notes?: string | null
          order_contact_snapshot_json?: Json | null
          order_date?: string
          order_source?: Database["public"]["Enums"]["sales_order_source"]
          order_type?: Database["public"]["Enums"]["sales_order_type"]
          payment_terms_snapshot?: string | null
          primary_showroom_enrollment_id?: string | null
          requested_ship_date?: string | null
          rga_id?: string | null
          sales_order_number?: string
          sales_rep_agency_id_snapshot?: string | null
          sales_rep_id_snapshot?: string | null
          ship_to_display_name_snapshot?: string
          ship_to_snapshot_json?: Json
          ship_to_type?: Database["public"]["Enums"]["sales_order_ship_to_type"]
          shipping_priority?: Database["public"]["Enums"]["shipping_priority"]
          shipping_readiness_status?: Database["public"]["Enums"]["shipping_readiness_status"]
          status?: Database["public"]["Enums"]["sales_order_status"]
          subtotal_amount?: number
          tax_amount?: number
          territory_id_snapshot?: string | null
          total_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_converted_from_quote_id_fkey"
            columns: ["converted_from_quote_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_converted_from_quote_id_fkey"
            columns: ["converted_from_quote_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
          {
            foreignKeyName: "sales_order_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sales_order_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_deleted_by_user_id_fkey"
            columns: ["deleted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_deleted_by_user_id_fkey"
            columns: ["deleted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sales_order_primary_showroom_enrollment_id_fkey"
            columns: ["primary_showroom_enrollment_id"]
            isOneToOne: false
            referencedRelation: "primary_showroom_enrollment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_rga_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_rga_fkey"
            columns: ["rga_id"]
            isOneToOne: false
            referencedRelation: "rga_dashboard_action_queue"
            referencedColumns: ["rga_id"]
          },
          {
            foreignKeyName: "sales_order_sales_rep_agency_snapshot_fkey"
            columns: ["sales_rep_agency_id_snapshot"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_sales_rep_snapshot_fkey"
            columns: ["sales_rep_id_snapshot"]
            isOneToOne: false
            referencedRelation: "sales_rep"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_territory_snapshot_fkey"
            columns: ["territory_id_snapshot"]
            isOneToOne: false
            referencedRelation: "territory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sales_order_document: {
        Row: {
          action: Database["public"]["Enums"]["sales_order_document_action"]
          document_number: string | null
          document_template_id: string | null
          document_type: Database["public"]["Enums"]["sales_order_document_type"]
          email_send_history_id: string | null
          generated_at: string
          generated_by_user_id: string | null
          generated_document_event_id: string | null
          id: string
          notes: string | null
          output_format: string
          sales_order_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["sales_order_document_action"]
          document_number?: string | null
          document_template_id?: string | null
          document_type: Database["public"]["Enums"]["sales_order_document_type"]
          email_send_history_id?: string | null
          generated_at?: string
          generated_by_user_id?: string | null
          generated_document_event_id?: string | null
          id?: string
          notes?: string | null
          output_format?: string
          sales_order_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["sales_order_document_action"]
          document_number?: string | null
          document_template_id?: string | null
          document_type?: Database["public"]["Enums"]["sales_order_document_type"]
          email_send_history_id?: string | null
          generated_at?: string
          generated_by_user_id?: string | null
          generated_document_event_id?: string | null
          id?: string
          notes?: string | null
          output_format?: string
          sales_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_document_document_template_id_fkey"
            columns: ["document_template_id"]
            isOneToOne: false
            referencedRelation: "document_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_document_email_send_history_id_fkey"
            columns: ["email_send_history_id"]
            isOneToOne: false
            referencedRelation: "email_send_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_document_generated_by_user_id_fkey"
            columns: ["generated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_document_generated_by_user_id_fkey"
            columns: ["generated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sales_order_document_generated_document_event_id_fkey"
            columns: ["generated_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_document_generated_document_event_id_fkey"
            columns: ["generated_document_event_id"]
            isOneToOne: false
            referencedRelation: "generated_document_event_metadata"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_document_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_document_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
        ]
      }
      sales_order_line: {
        Row: {
          brand_id_snapshot: string | null
          brand_name_snapshot: string
          created_at: string
          created_by_user_id: string | null
          discount_overridden: boolean
          discount_override_reason: string | null
          discount_percent: number
          display_counts_toward_primary_showroom: boolean | null
          display_discount_percent_snapshot: number | null
          display_exclusion_reason: string | null
          estimated_ship_date: string | null
          id: string
          line_number: number
          line_status: Database["public"]["Enums"]["sales_order_line_status"]
          line_total: number | null
          notes: string | null
          price_overridden: boolean
          price_override_reason: string | null
          product_eligibility_snapshot:
            | Database["public"]["Enums"]["product_customer_eligibility_tag"]
            | null
          product_id: string
          product_name_snapshot: string
          product_sellability_snapshot:
            | Database["public"]["Enums"]["product_sellability_status"]
            | null
          product_sku_snapshot: string
          product_status_snapshot:
            | Database["public"]["Enums"]["product_lifecycle_status"]
            | null
          quantity_allocated: number
          quantity_cancelled: number
          quantity_cleared: number
          quantity_ordered: number
          quantity_shipped: number
          requested_ship_date: string | null
          restricted_product_override: boolean
          restricted_product_override_reason: string | null
          sales_order_id: string
          unit_price: number
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          brand_id_snapshot?: string | null
          brand_name_snapshot: string
          created_at?: string
          created_by_user_id?: string | null
          discount_overridden?: boolean
          discount_override_reason?: string | null
          discount_percent?: number
          display_counts_toward_primary_showroom?: boolean | null
          display_discount_percent_snapshot?: number | null
          display_exclusion_reason?: string | null
          estimated_ship_date?: string | null
          id?: string
          line_number: number
          line_status?: Database["public"]["Enums"]["sales_order_line_status"]
          line_total?: number | null
          notes?: string | null
          price_overridden?: boolean
          price_override_reason?: string | null
          product_eligibility_snapshot?:
            | Database["public"]["Enums"]["product_customer_eligibility_tag"]
            | null
          product_id: string
          product_name_snapshot: string
          product_sellability_snapshot?:
            | Database["public"]["Enums"]["product_sellability_status"]
            | null
          product_sku_snapshot: string
          product_status_snapshot?:
            | Database["public"]["Enums"]["product_lifecycle_status"]
            | null
          quantity_allocated?: number
          quantity_cancelled?: number
          quantity_cleared?: number
          quantity_ordered: number
          quantity_shipped?: number
          requested_ship_date?: string | null
          restricted_product_override?: boolean
          restricted_product_override_reason?: string | null
          sales_order_id: string
          unit_price: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          brand_id_snapshot?: string | null
          brand_name_snapshot?: string
          created_at?: string
          created_by_user_id?: string | null
          discount_overridden?: boolean
          discount_override_reason?: string | null
          discount_percent?: number
          display_counts_toward_primary_showroom?: boolean | null
          display_discount_percent_snapshot?: number | null
          display_exclusion_reason?: string | null
          estimated_ship_date?: string | null
          id?: string
          line_number?: number
          line_status?: Database["public"]["Enums"]["sales_order_line_status"]
          line_total?: number | null
          notes?: string | null
          price_overridden?: boolean
          price_override_reason?: string | null
          product_eligibility_snapshot?:
            | Database["public"]["Enums"]["product_customer_eligibility_tag"]
            | null
          product_id?: string
          product_name_snapshot?: string
          product_sellability_snapshot?:
            | Database["public"]["Enums"]["product_sellability_status"]
            | null
          product_sku_snapshot?: string
          product_status_snapshot?:
            | Database["public"]["Enums"]["product_lifecycle_status"]
            | null
          quantity_allocated?: number
          quantity_cancelled?: number
          quantity_cleared?: number
          quantity_ordered?: number
          quantity_shipped?: number
          requested_ship_date?: string | null
          restricted_product_override?: boolean
          restricted_product_override_reason?: string | null
          sales_order_id?: string
          unit_price?: number
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_line_brand_id_snapshot_fkey"
            columns: ["brand_id_snapshot"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sales_order_line_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
          {
            foreignKeyName: "sales_order_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sales_rep: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          email: string | null
          id: string
          is_principal: boolean
          name: string
          notes: string | null
          phone: string | null
          portal_user_id: string | null
          rep_customer_location_id: string | null
          role_title: string | null
          sales_rep_agency_id: string
          status: Database["public"]["Enums"]["sales_rep_status"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          id?: string
          is_principal?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          portal_user_id?: string | null
          rep_customer_location_id?: string | null
          role_title?: string | null
          sales_rep_agency_id: string
          status?: Database["public"]["Enums"]["sales_rep_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          id?: string
          is_principal?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          portal_user_id?: string | null
          rep_customer_location_id?: string | null
          role_title?: string | null
          sales_rep_agency_id?: string
          status?: Database["public"]["Enums"]["sales_rep_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_rep_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_rep_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sales_rep_portal_user_id_fkey"
            columns: ["portal_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_rep_portal_user_id_fkey"
            columns: ["portal_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sales_rep_rep_customer_location_id_fkey"
            columns: ["rep_customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_rep_sales_rep_agency_id_fkey"
            columns: ["sales_rep_agency_id"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_rep_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_rep_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sales_rep_agency: {
        Row: {
          ach_payment_status: Database["public"]["Enums"]["rep_ach_payment_status"]
          agency_code: string
          commission_default_percent: number
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string | null
          email: string | null
          id: string
          main_contact_name: string | null
          name: string
          notes: string | null
          phone: string | null
          portal_access_enabled: boolean
          status: Database["public"]["Enums"]["sales_rep_agency_status"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          ach_payment_status?: Database["public"]["Enums"]["rep_ach_payment_status"]
          agency_code: string
          commission_default_percent?: number
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string | null
          email?: string | null
          id?: string
          main_contact_name?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          portal_access_enabled?: boolean
          status?: Database["public"]["Enums"]["sales_rep_agency_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          ach_payment_status?: Database["public"]["Enums"]["rep_ach_payment_status"]
          agency_code?: string
          commission_default_percent?: number
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string | null
          email?: string | null
          id?: string
          main_contact_name?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          portal_access_enabled?: boolean
          status?: Database["public"]["Enums"]["sales_rep_agency_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_rep_agency_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_rep_agency_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sales_rep_agency_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_rep_agency_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_rep_agency_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saved_report_configuration: {
        Row: {
          brand_filter_id: string | null
          column_mapping_json: Json
          created_at: string
          created_by_user_id: string | null
          customer_account_id: string | null
          customer_location_id: string | null
          file_format: Database["public"]["Enums"]["report_output_format"]
          filters_json: Json
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          owner_user_id: string | null
          report_definition_id: string
          selected_columns_json: Json
          shared_department: string | null
          shared_role_id: string | null
          shared_scope: Database["public"]["Enums"]["report_shared_scope"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          brand_filter_id?: string | null
          column_mapping_json?: Json
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string | null
          customer_location_id?: string | null
          file_format?: Database["public"]["Enums"]["report_output_format"]
          filters_json?: Json
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          owner_user_id?: string | null
          report_definition_id: string
          selected_columns_json?: Json
          shared_department?: string | null
          shared_role_id?: string | null
          shared_scope?: Database["public"]["Enums"]["report_shared_scope"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          brand_filter_id?: string | null
          column_mapping_json?: Json
          created_at?: string
          created_by_user_id?: string | null
          customer_account_id?: string | null
          customer_location_id?: string | null
          file_format?: Database["public"]["Enums"]["report_output_format"]
          filters_json?: Json
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          owner_user_id?: string | null
          report_definition_id?: string
          selected_columns_json?: Json
          shared_department?: string | null
          shared_role_id?: string | null
          shared_scope?: Database["public"]["Enums"]["report_shared_scope"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_report_configuration_brand_filter_id_fkey"
            columns: ["brand_filter_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_report_configuration_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_report_configuration_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "saved_report_configuration_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_report_configuration_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_report_configuration_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_report_configuration_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "saved_report_configuration_report_definition_id_fkey"
            columns: ["report_definition_id"]
            isOneToOne: false
            referencedRelation: "report_definition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_report_configuration_shared_role_id_fkey"
            columns: ["shared_role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_report_configuration_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_report_configuration_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      scheduled_report: {
        Row: {
          bcc_addresses: string[]
          cc_addresses: string[]
          created_at: string
          created_by_user_id: string | null
          email_template_id: string | null
          id: string
          last_run_at: string | null
          next_run_at: string | null
          report_name: string
          saved_report_configuration_id: string
          schedule_days: number[]
          schedule_frequency: Database["public"]["Enums"]["scheduled_report_frequency"]
          schedule_time: string
          status: Database["public"]["Enums"]["scheduled_report_status"]
          time_zone: string
          to_addresses: string[]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          bcc_addresses?: string[]
          cc_addresses?: string[]
          created_at?: string
          created_by_user_id?: string | null
          email_template_id?: string | null
          id?: string
          last_run_at?: string | null
          next_run_at?: string | null
          report_name: string
          saved_report_configuration_id: string
          schedule_days?: number[]
          schedule_frequency: Database["public"]["Enums"]["scheduled_report_frequency"]
          schedule_time: string
          status?: Database["public"]["Enums"]["scheduled_report_status"]
          time_zone?: string
          to_addresses?: string[]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          bcc_addresses?: string[]
          cc_addresses?: string[]
          created_at?: string
          created_by_user_id?: string | null
          email_template_id?: string | null
          id?: string
          last_run_at?: string | null
          next_run_at?: string | null
          report_name?: string
          saved_report_configuration_id?: string
          schedule_days?: number[]
          schedule_frequency?: Database["public"]["Enums"]["scheduled_report_frequency"]
          schedule_time?: string
          status?: Database["public"]["Enums"]["scheduled_report_status"]
          time_zone?: string
          to_addresses?: string[]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_report_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_report_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "scheduled_report_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_report_saved_report_configuration_id_fkey"
            columns: ["saved_report_configuration_id"]
            isOneToOne: false
            referencedRelation: "saved_report_configuration"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_report_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_report_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      scheduled_report_run: {
        Row: {
          created_at: string
          email_body_snapshot: string | null
          email_subject_snapshot: string | null
          error_message: string | null
          generated_file_id: string | null
          id: string
          recipient_snapshot: Json
          record_count: number | null
          report_export_run_id: string | null
          run_finished_at: string | null
          run_started_at: string
          scheduled_report_id: string
          send_status: string
        }
        Insert: {
          created_at?: string
          email_body_snapshot?: string | null
          email_subject_snapshot?: string | null
          error_message?: string | null
          generated_file_id?: string | null
          id?: string
          recipient_snapshot?: Json
          record_count?: number | null
          report_export_run_id?: string | null
          run_finished_at?: string | null
          run_started_at?: string
          scheduled_report_id: string
          send_status?: string
        }
        Update: {
          created_at?: string
          email_body_snapshot?: string | null
          email_subject_snapshot?: string | null
          error_message?: string | null
          generated_file_id?: string | null
          id?: string
          recipient_snapshot?: Json
          record_count?: number | null
          report_export_run_id?: string | null
          run_finished_at?: string | null
          run_started_at?: string
          scheduled_report_id?: string
          send_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_report_run_generated_file_id_fkey"
            columns: ["generated_file_id"]
            isOneToOne: false
            referencedRelation: "attachment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_report_run_report_export_run_id_fkey"
            columns: ["report_export_run_id"]
            isOneToOne: false
            referencedRelation: "report_export_run"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_report_run_scheduled_report_id_fkey"
            columns: ["scheduled_report_id"]
            isOneToOne: false
            referencedRelation: "scheduled_report"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_adjustment: {
        Row: {
          adjusted_at: string
          adjusted_by_user_id: string
          adjusted_quantity_shipped: number
          adjustment_quantity: number | null
          created_at: string
          freight_shipment_id: string | null
          id: string
          inventory_movement_id: string | null
          notes: string | null
          original_quantity_shipped: number
          packing_list_id: string
          packing_list_line_box_id: string | null
          packing_list_line_id: string
          product_id: string
          product_packing_box_id: string | null
          reason: string
          sales_order_id: string
          sales_order_line_id: string
          status: Database["public"]["Enums"]["shipment_adjustment_status"]
          warehouse_id: string | null
          warehouse_location_id: string | null
        }
        Insert: {
          adjusted_at?: string
          adjusted_by_user_id: string
          adjusted_quantity_shipped: number
          adjustment_quantity?: number | null
          created_at?: string
          freight_shipment_id?: string | null
          id?: string
          inventory_movement_id?: string | null
          notes?: string | null
          original_quantity_shipped: number
          packing_list_id: string
          packing_list_line_box_id?: string | null
          packing_list_line_id: string
          product_id: string
          product_packing_box_id?: string | null
          reason: string
          sales_order_id: string
          sales_order_line_id: string
          status?: Database["public"]["Enums"]["shipment_adjustment_status"]
          warehouse_id?: string | null
          warehouse_location_id?: string | null
        }
        Update: {
          adjusted_at?: string
          adjusted_by_user_id?: string
          adjusted_quantity_shipped?: number
          adjustment_quantity?: number | null
          created_at?: string
          freight_shipment_id?: string | null
          id?: string
          inventory_movement_id?: string | null
          notes?: string | null
          original_quantity_shipped?: number
          packing_list_id?: string
          packing_list_line_box_id?: string | null
          packing_list_line_id?: string
          product_id?: string
          product_packing_box_id?: string | null
          reason?: string
          sales_order_id?: string
          sales_order_line_id?: string
          status?: Database["public"]["Enums"]["shipment_adjustment_status"]
          warehouse_id?: string | null
          warehouse_location_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_adjustment_adjusted_by_user_id_fkey"
            columns: ["adjusted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_adjusted_by_user_id_fkey"
            columns: ["adjusted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "shipment_adjustment_freight_shipment_id_fkey"
            columns: ["freight_shipment_id"]
            isOneToOne: false
            referencedRelation: "freight_shipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_inventory_movement_id_fkey"
            columns: ["inventory_movement_id"]
            isOneToOne: false
            referencedRelation: "inventory_movement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_packing_list_id_fkey"
            columns: ["packing_list_id"]
            isOneToOne: false
            referencedRelation: "packing_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_packing_list_line_box_id_fkey"
            columns: ["packing_list_line_box_id"]
            isOneToOne: false
            referencedRelation: "packing_list_line_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_packing_list_line_id_fkey"
            columns: ["packing_list_line_id"]
            isOneToOne: false
            referencedRelation: "packing_list_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "shipment_adjustment_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "shipment_adjustment_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "shipment_adjustment_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_packing_box"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_product_packing_box_id_fkey"
            columns: ["product_packing_box_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_packing_box_id"]
          },
          {
            foreignKeyName: "shipment_adjustment_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
          {
            foreignKeyName: "shipment_adjustment_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "rga_available_sales_order_lines"
            referencedColumns: ["sales_order_line_id"]
          },
          {
            foreignKeyName: "shipment_adjustment_sales_order_line_id_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "sales_order_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_adjustment_warehouse_location_id_fkey"
            columns: ["warehouse_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_location"
            referencedColumns: ["id"]
          },
        ]
      }
      showroom_display: {
        Row: {
          brand_id: string | null
          counts_toward_primary_showroom: boolean
          created_at: string
          created_by_user_id: string | null
          customer_location_id: string
          customer_po_number_snapshot: string | null
          display_discount_percent_snapshot: number | null
          display_order_date: string | null
          display_shipped_date_snapshot: string | null
          display_status: Database["public"]["Enums"]["showroom_display_status"]
          id: string
          installed_date: string | null
          last_verified_date: string | null
          minimum_floor_through_date: string | null
          notes: string | null
          primary_showroom_enrollment_id: string | null
          primary_showroom_exclusion_reason: string | null
          product_id: string | null
          product_name_snapshot: string | null
          sales_order_id: string | null
          sales_order_line_id: string | null
          sku_snapshot: string
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          brand_id?: string | null
          counts_toward_primary_showroom?: boolean
          created_at?: string
          created_by_user_id?: string | null
          customer_location_id: string
          customer_po_number_snapshot?: string | null
          display_discount_percent_snapshot?: number | null
          display_order_date?: string | null
          display_shipped_date_snapshot?: string | null
          display_status?: Database["public"]["Enums"]["showroom_display_status"]
          id?: string
          installed_date?: string | null
          last_verified_date?: string | null
          minimum_floor_through_date?: string | null
          notes?: string | null
          primary_showroom_enrollment_id?: string | null
          primary_showroom_exclusion_reason?: string | null
          product_id?: string | null
          product_name_snapshot?: string | null
          sales_order_id?: string | null
          sales_order_line_id?: string | null
          sku_snapshot: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          brand_id?: string | null
          counts_toward_primary_showroom?: boolean
          created_at?: string
          created_by_user_id?: string | null
          customer_location_id?: string
          customer_po_number_snapshot?: string | null
          display_discount_percent_snapshot?: number | null
          display_order_date?: string | null
          display_shipped_date_snapshot?: string | null
          display_status?: Database["public"]["Enums"]["showroom_display_status"]
          id?: string
          installed_date?: string | null
          last_verified_date?: string | null
          minimum_floor_through_date?: string | null
          notes?: string | null
          primary_showroom_enrollment_id?: string | null
          primary_showroom_exclusion_reason?: string | null
          product_id?: string | null
          product_name_snapshot?: string | null
          sales_order_id?: string | null
          sales_order_line_id?: string | null
          sku_snapshot?: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "showroom_display_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showroom_display_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showroom_display_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "showroom_display_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showroom_display_primary_showroom_enrollment_id_fkey"
            columns: ["primary_showroom_enrollment_id"]
            isOneToOne: false
            referencedRelation: "primary_showroom_enrollment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showroom_display_product_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "showroom_display_product_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showroom_display_product_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "showroom_display_product_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "showroom_display_sales_order_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showroom_display_sales_order_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
          {
            foreignKeyName: "showroom_display_sales_order_line_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "rga_available_sales_order_lines"
            referencedColumns: ["sales_order_line_id"]
          },
          {
            foreignKeyName: "showroom_display_sales_order_line_fkey"
            columns: ["sales_order_line_id"]
            isOneToOne: false
            referencedRelation: "sales_order_line"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showroom_display_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showroom_display_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      system_setting: {
        Row: {
          category: Database["public"]["Enums"]["system_setting_category"]
          created_at: string
          created_by_user_id: string | null
          default_value_json: Json | null
          description: string | null
          id: string
          is_sensitive: boolean
          is_user_editable: boolean
          setting_key: string
          setting_label: string
          setting_value: Json | null
          updated_at: string
          updated_by_user_id: string | null
          validation_json: Json
          value_type: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["system_setting_category"]
          created_at?: string
          created_by_user_id?: string | null
          default_value_json?: Json | null
          description?: string | null
          id?: string
          is_sensitive?: boolean
          is_user_editable?: boolean
          setting_key: string
          setting_label: string
          setting_value?: Json | null
          updated_at?: string
          updated_by_user_id?: string | null
          validation_json?: Json
          value_type?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["system_setting_category"]
          created_at?: string
          created_by_user_id?: string | null
          default_value_json?: Json | null
          description?: string | null
          id?: string
          is_sensitive?: boolean
          is_user_editable?: boolean
          setting_key?: string
          setting_label?: string
          setting_value?: Json | null
          updated_at?: string
          updated_by_user_id?: string | null
          validation_json?: Json
          value_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_setting_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_setting_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "system_setting_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_setting_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      system_setting_change_history: {
        Row: {
          change_reason: string | null
          changed_at: string
          changed_by_user_id: string | null
          id: string
          impersonation_session_id: string | null
          new_value: Json | null
          old_value: Json | null
          setting_key: string
          system_setting_id: string | null
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          changed_by_user_id?: string | null
          id?: string
          impersonation_session_id?: string | null
          new_value?: Json | null
          old_value?: Json | null
          setting_key: string
          system_setting_id?: string | null
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          changed_by_user_id?: string | null
          id?: string
          impersonation_session_id?: string | null
          new_value?: Json | null
          old_value?: Json | null
          setting_key?: string
          system_setting_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_setting_change_history_changed_by_user_id_fkey"
            columns: ["changed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_setting_change_history_changed_by_user_id_fkey"
            columns: ["changed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "system_setting_change_history_impersonation_session_id_fkey"
            columns: ["impersonation_session_id"]
            isOneToOne: false
            referencedRelation: "active_impersonation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_setting_change_history_impersonation_session_id_fkey"
            columns: ["impersonation_session_id"]
            isOneToOne: false
            referencedRelation: "user_impersonation_session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_setting_change_history_system_setting_id_fkey"
            columns: ["system_setting_id"]
            isOneToOne: false
            referencedRelation: "system_setting"
            referencedColumns: ["id"]
          },
        ]
      }
      territory: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          description: string | null
          id: string
          map_color: string | null
          map_sort_order: number | null
          name: string
          state_codes_json: Json
          status: Database["public"]["Enums"]["territory_status"]
          territory_code: string
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          map_color?: string | null
          map_sort_order?: number | null
          name: string
          state_codes_json?: Json
          status?: Database["public"]["Enums"]["territory_status"]
          territory_code: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          map_color?: string | null
          map_sort_order?: number | null
          name?: string
          state_codes_json?: Json
          status?: Database["public"]["Enums"]["territory_status"]
          territory_code?: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "territory_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "territory_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      territory_assignment: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          end_date: string | null
          id: string
          notes: string | null
          sales_rep_agency_id: string
          start_date: string
          status: Database["public"]["Enums"]["rep_assignment_status"]
          territory_id: string
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          sales_rep_agency_id: string
          start_date?: string
          status?: Database["public"]["Enums"]["rep_assignment_status"]
          territory_id: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          sales_rep_agency_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["rep_assignment_status"]
          territory_id?: string
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "territory_assignment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_assignment_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "territory_assignment_sales_rep_agency_id_fkey"
            columns: ["sales_rep_agency_id"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_assignment_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_assignment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_assignment_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      training_feedback: {
        Row: {
          assigned_to_user_id: string | null
          created_at: string
          department: string | null
          description: string
          feedback_type: string
          id: string
          resolved_at: string | null
          status: string
          submitted_by_user_id: string | null
        }
        Insert: {
          assigned_to_user_id?: string | null
          created_at?: string
          department?: string | null
          description: string
          feedback_type: string
          id?: string
          resolved_at?: string | null
          status?: string
          submitted_by_user_id?: string | null
        }
        Update: {
          assigned_to_user_id?: string | null
          created_at?: string
          department?: string | null
          description?: string
          feedback_type?: string
          id?: string
          resolved_at?: string | null
          status?: string
          submitted_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_feedback_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_feedback_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "training_feedback_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_feedback_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_account: {
        Row: {
          auth_user_id: string | null
          created_at: string
          customer_account_id: string | null
          default_customer_location_id: string | null
          default_landing_dashboard: string | null
          department: string | null
          disabled_at: string | null
          disabled_by_user_id: string | null
          disabled_reason: string | null
          display_name: string
          email: string
          id: string
          internal_employee_code: string | null
          is_active: boolean
          last_login_at: string | null
          mfa_enabled: boolean
          mfa_enforced_at: string | null
          mfa_last_verified_at: string | null
          mfa_required: boolean
          portal_scope_entity_id: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          customer_account_id?: string | null
          default_customer_location_id?: string | null
          default_landing_dashboard?: string | null
          department?: string | null
          disabled_at?: string | null
          disabled_by_user_id?: string | null
          disabled_reason?: string | null
          display_name: string
          email: string
          id?: string
          internal_employee_code?: string | null
          is_active?: boolean
          last_login_at?: string | null
          mfa_enabled?: boolean
          mfa_enforced_at?: string | null
          mfa_last_verified_at?: string | null
          mfa_required?: boolean
          portal_scope_entity_id?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          customer_account_id?: string | null
          default_customer_location_id?: string | null
          default_landing_dashboard?: string | null
          department?: string | null
          disabled_at?: string | null
          disabled_by_user_id?: string | null
          disabled_reason?: string | null
          display_name?: string
          email?: string
          id?: string
          internal_employee_code?: string | null
          is_active?: boolean
          last_login_at?: string | null
          mfa_enabled?: boolean
          mfa_enforced_at?: string | null
          mfa_last_verified_at?: string | null
          mfa_required?: boolean
          portal_scope_entity_id?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: [
          {
            foreignKeyName: "user_account_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_account_default_customer_location_id_fkey"
            columns: ["default_customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_account_disabled_by_user_id_fkey"
            columns: ["disabled_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_account_disabled_by_user_id_fkey"
            columns: ["disabled_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_data_scope: {
        Row: {
          id: string
          is_active: boolean
          is_primary: boolean
          scope_entity_id: string | null
          scope_type: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          is_primary?: boolean
          scope_entity_id?: string | null
          scope_type: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          is_primary?: boolean
          scope_entity_id?: string | null
          scope_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_data_scope_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_data_scope_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_impersonation_session: {
        Row: {
          admin_user_id: string
          ended_at: string | null
          ended_by_user_id: string | null
          ended_reason: string | null
          id: string
          impersonated_user_id: string
          ip_address: unknown
          last_activity_at: string
          max_duration_minutes: number
          reason: string
          started_at: string
          status: Database["public"]["Enums"]["impersonation_status"]
          user_agent: string | null
        }
        Insert: {
          admin_user_id: string
          ended_at?: string | null
          ended_by_user_id?: string | null
          ended_reason?: string | null
          id?: string
          impersonated_user_id: string
          ip_address?: unknown
          last_activity_at?: string
          max_duration_minutes?: number
          reason: string
          started_at?: string
          status?: Database["public"]["Enums"]["impersonation_status"]
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string
          ended_at?: string | null
          ended_by_user_id?: string | null
          ended_reason?: string | null
          id?: string
          impersonated_user_id?: string
          ip_address?: unknown
          last_activity_at?: string
          max_duration_minutes?: number
          reason?: string
          started_at?: string
          status?: Database["public"]["Enums"]["impersonation_status"]
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_impersonation_session_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_impersonation_session_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_impersonation_session_ended_by_user_id_fkey"
            columns: ["ended_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_impersonation_session_ended_by_user_id_fkey"
            columns: ["ended_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_impersonation_session_impersonated_user_id_fkey"
            columns: ["impersonated_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_impersonation_session_impersonated_user_id_fkey"
            columns: ["impersonated_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_permission_override: {
        Row: {
          approved_at: string | null
          approved_by_user_id: string | null
          created_at: string
          created_by_user_id: string | null
          expires_at: string | null
          id: string
          is_permanent: boolean
          last_reviewed_at: string | null
          last_reviewed_by_user_id: string | null
          override_type: Database["public"]["Enums"]["permission_override_type"]
          permission_id: string
          permission_level: Database["public"]["Enums"]["permission_level"]
          reason: string
          review_due_at: string | null
          revoke_reason: string | null
          revoked_at: string | null
          revoked_by_user_id: string | null
          status: Database["public"]["Enums"]["permission_override_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by_user_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          expires_at?: string | null
          id?: string
          is_permanent?: boolean
          last_reviewed_at?: string | null
          last_reviewed_by_user_id?: string | null
          override_type: Database["public"]["Enums"]["permission_override_type"]
          permission_id: string
          permission_level: Database["public"]["Enums"]["permission_level"]
          reason: string
          review_due_at?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by_user_id?: string | null
          status?: Database["public"]["Enums"]["permission_override_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by_user_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          expires_at?: string | null
          id?: string
          is_permanent?: boolean
          last_reviewed_at?: string | null
          last_reviewed_by_user_id?: string | null
          override_type?: Database["public"]["Enums"]["permission_override_type"]
          permission_id?: string
          permission_level?: Database["public"]["Enums"]["permission_level"]
          reason?: string
          review_due_at?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by_user_id?: string | null
          status?: Database["public"]["Enums"]["permission_override_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permission_override_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_override_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_permission_override_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_override_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_permission_override_last_reviewed_by_user_id_fkey"
            columns: ["last_reviewed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_override_last_reviewed_by_user_id_fkey"
            columns: ["last_reviewed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_permission_override_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_override_revoked_by_user_id_fkey"
            columns: ["revoked_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_override_revoked_by_user_id_fkey"
            columns: ["revoked_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_permission_override_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_override_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_role: {
        Row: {
          assigned_at: string
          assigned_by_user_id: string | null
          id: string
          is_active: boolean
          removal_reason: string | null
          removed_at: string | null
          removed_by_user_id: string | null
          role_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by_user_id?: string | null
          id?: string
          is_active?: boolean
          removal_reason?: string | null
          removed_at?: string | null
          removed_by_user_id?: string | null
          role_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by_user_id?: string | null
          id?: string
          is_active?: boolean
          removal_reason?: string | null
          removed_at?: string | null
          removed_by_user_id?: string | null
          role_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assigned_by_user_id_fkey"
            columns: ["assigned_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assigned_by_user_id_fkey"
            columns: ["assigned_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_role_removed_by_user_id_fkey"
            columns: ["removed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_removed_by_user_id_fkey"
            columns: ["removed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_role_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vendor: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          contact_name: string | null
          country: string
          country_code: string
          created_at: string
          created_by_user_id: string | null
          currency: string
          email: string | null
          id: string
          legal_name: string | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          postal_code: string | null
          state_province: string | null
          status: Database["public"]["Enums"]["vendor_status"]
          updated_at: string
          updated_by_user_id: string | null
          vendor_number: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          contact_name?: string | null
          country: string
          country_code: string
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          state_province?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_number?: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          contact_name?: string | null
          country?: string
          country_code?: string
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          state_province?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vendor_contact: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          email: string | null
          id: string
          is_active: boolean
          is_primary: boolean
          name: string
          phone: string | null
          title: string | null
          updated_at: string
          updated_by_user_id: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          name: string
          phone?: string | null
          title?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          name?: string
          phone?: string | null
          title?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_contact_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_contact_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_contact_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_contact_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_contact_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_po_invoice: {
        Row: {
          amount_paid: number
          balance_due: number | null
          created_at: string
          created_by_user_id: string | null
          currency: string
          due_date: string | null
          id: string
          invoice_amount: number
          invoice_date: string | null
          notes: string | null
          paid_date: string | null
          payment_method:
            | Database["public"]["Enums"]["vendor_payment_method"]
            | null
          payment_status: Database["public"]["Enums"]["vendor_po_invoice_payment_status"]
          updated_at: string
          updated_by_user_id: string | null
          vendor_id: string
          vendor_invoice_number: string
          vendor_purchase_order_id: string
        }
        Insert: {
          amount_paid?: number
          balance_due?: number | null
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          due_date?: string | null
          id?: string
          invoice_amount: number
          invoice_date?: string | null
          notes?: string | null
          paid_date?: string | null
          payment_method?:
            | Database["public"]["Enums"]["vendor_payment_method"]
            | null
          payment_status?: Database["public"]["Enums"]["vendor_po_invoice_payment_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_id: string
          vendor_invoice_number: string
          vendor_purchase_order_id: string
        }
        Update: {
          amount_paid?: number
          balance_due?: number | null
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          due_date?: string | null
          id?: string
          invoice_amount?: number
          invoice_date?: string | null
          notes?: string | null
          paid_date?: string | null
          payment_method?:
            | Database["public"]["Enums"]["vendor_payment_method"]
            | null
          payment_status?: Database["public"]["Enums"]["vendor_po_invoice_payment_status"]
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_id?: string
          vendor_invoice_number?: string
          vendor_purchase_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_po_invoice_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_po_invoice_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_po_invoice_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_po_invoice_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_po_invoice_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_po_invoice_vendor_purchase_order_id_fkey"
            columns: ["vendor_purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchasing_dashboard_open_items"
            referencedColumns: ["vendor_purchase_order_id"]
          },
          {
            foreignKeyName: "vendor_po_invoice_vendor_purchase_order_id_fkey"
            columns: ["vendor_purchase_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_purchase_order"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_po_submission_history: {
        Row: {
          email_send_history_id: string | null
          id: string
          notes: string | null
          submission_status: Database["public"]["Enums"]["vendor_po_submission_status"]
          submitted_at: string
          submitted_by_user_id: string | null
          vendor_purchase_order_id: string
        }
        Insert: {
          email_send_history_id?: string | null
          id?: string
          notes?: string | null
          submission_status: Database["public"]["Enums"]["vendor_po_submission_status"]
          submitted_at?: string
          submitted_by_user_id?: string | null
          vendor_purchase_order_id: string
        }
        Update: {
          email_send_history_id?: string | null
          id?: string
          notes?: string | null
          submission_status?: Database["public"]["Enums"]["vendor_po_submission_status"]
          submitted_at?: string
          submitted_by_user_id?: string | null
          vendor_purchase_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_po_submission_history_email_send_history_id_fkey"
            columns: ["email_send_history_id"]
            isOneToOne: false
            referencedRelation: "email_send_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_po_submission_history_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_po_submission_history_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_po_submission_history_vendor_purchase_order_id_fkey"
            columns: ["vendor_purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchasing_dashboard_open_items"
            referencedColumns: ["vendor_purchase_order_id"]
          },
          {
            foreignKeyName: "vendor_po_submission_history_vendor_purchase_order_id_fkey"
            columns: ["vendor_purchase_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_purchase_order"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_product: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          currency: string
          id: string
          is_active: boolean
          is_primary_vendor: boolean
          lead_time_days: number | null
          minimum_order_quantity: number | null
          notes: string | null
          product_id: string
          unit_cost: number
          updated_at: string
          updated_by_user_id: string | null
          vendor_id: string
          vendor_item_name: string | null
          vendor_item_number: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          id?: string
          is_active?: boolean
          is_primary_vendor?: boolean
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          notes?: string | null
          product_id: string
          unit_cost?: number
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_id: string
          vendor_item_name?: string | null
          vendor_item_number: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          id?: string
          is_active?: boolean
          is_primary_vendor?: boolean
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          notes?: string | null
          product_id?: string
          unit_cost?: number
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_id?: string
          vendor_item_name?: string | null
          vendor_item_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_product_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_product_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "vendor_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "vendor_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "vendor_product_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_product_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_product_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_purchase_order: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          currency: string
          expected_ready_date: string | null
          expected_ship_date: string | null
          freight_amount: number
          id: string
          notes: string | null
          po_date: string
          status: Database["public"]["Enums"]["vendor_purchase_order_status"]
          submitted_at: string | null
          submitted_by_user_id: string | null
          subtotal_amount: number
          total_amount: number | null
          updated_at: string
          updated_by_user_id: string | null
          vendor_address_snapshot_json: Json | null
          vendor_id: string
          vendor_name_snapshot: string
          vendor_po_number: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          expected_ready_date?: string | null
          expected_ship_date?: string | null
          freight_amount?: number
          id?: string
          notes?: string | null
          po_date?: string
          status?: Database["public"]["Enums"]["vendor_purchase_order_status"]
          submitted_at?: string | null
          submitted_by_user_id?: string | null
          subtotal_amount?: number
          total_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_address_snapshot_json?: Json | null
          vendor_id: string
          vendor_name_snapshot: string
          vendor_po_number?: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          expected_ready_date?: string | null
          expected_ship_date?: string | null
          freight_amount?: number
          id?: string
          notes?: string | null
          po_date?: string
          status?: Database["public"]["Enums"]["vendor_purchase_order_status"]
          submitted_at?: string | null
          submitted_by_user_id?: string | null
          subtotal_amount?: number
          total_amount?: number | null
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_address_snapshot_json?: Json | null
          vendor_id?: string
          vendor_name_snapshot?: string
          vendor_po_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_purchase_order_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_purchase_order_line: {
        Row: {
          brand_id_snapshot: string | null
          brand_name_snapshot: string | null
          cost_overridden: boolean
          cost_override_reason: string | null
          created_at: string
          created_by_user_id: string | null
          expected_ready_date: string | null
          id: string
          line_status: Database["public"]["Enums"]["vendor_purchase_order_line_status"]
          line_total: number | null
          notes: string | null
          product_id: string
          product_name_snapshot: string
          product_sku_snapshot: string
          quantity_ordered: number
          quantity_received: number
          unit_cost: number
          updated_at: string
          updated_by_user_id: string | null
          vendor_item_name_snapshot: string | null
          vendor_item_number_snapshot: string
          vendor_product_id: string
          vendor_purchase_order_id: string
        }
        Insert: {
          brand_id_snapshot?: string | null
          brand_name_snapshot?: string | null
          cost_overridden?: boolean
          cost_override_reason?: string | null
          created_at?: string
          created_by_user_id?: string | null
          expected_ready_date?: string | null
          id?: string
          line_status?: Database["public"]["Enums"]["vendor_purchase_order_line_status"]
          line_total?: number | null
          notes?: string | null
          product_id: string
          product_name_snapshot: string
          product_sku_snapshot: string
          quantity_ordered: number
          quantity_received?: number
          unit_cost: number
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_item_name_snapshot?: string | null
          vendor_item_number_snapshot: string
          vendor_product_id: string
          vendor_purchase_order_id: string
        }
        Update: {
          brand_id_snapshot?: string | null
          brand_name_snapshot?: string | null
          cost_overridden?: boolean
          cost_override_reason?: string | null
          created_at?: string
          created_by_user_id?: string | null
          expected_ready_date?: string | null
          id?: string
          line_status?: Database["public"]["Enums"]["vendor_purchase_order_line_status"]
          line_total?: number | null
          notes?: string | null
          product_id?: string
          product_name_snapshot?: string
          product_sku_snapshot?: string
          quantity_ordered?: number
          quantity_received?: number
          unit_cost?: number
          updated_at?: string
          updated_by_user_id?: string | null
          vendor_item_name_snapshot?: string | null
          vendor_item_number_snapshot?: string
          vendor_product_id?: string
          vendor_purchase_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_purchase_order_line_brand_id_snapshot_fkey"
            columns: ["brand_id_snapshot"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_vendor_purchase_order_id_fkey"
            columns: ["vendor_purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchasing_dashboard_open_items"
            referencedColumns: ["vendor_purchase_order_id"]
          },
          {
            foreignKeyName: "vendor_purchase_order_line_vendor_purchase_order_id_fkey"
            columns: ["vendor_purchase_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_purchase_order"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          country: string
          country_code: string
          created_at: string
          created_by_user_id: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          postal_code: string | null
          state_province: string | null
          updated_at: string
          updated_by_user_id: string | null
          warehouse_code: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string
          country_code?: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          postal_code?: string | null
          state_province?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_code: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string
          country_code?: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          postal_code?: string | null
          state_province?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "warehouse_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      warehouse_location: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          id: string
          is_active: boolean
          is_damaged_location: boolean
          is_hold_location: boolean
          is_pickable: boolean
          is_receiving_location: boolean
          is_shipping_location: boolean
          is_temporary_location: boolean
          location_code: string
          location_name: string | null
          location_type: Database["public"]["Enums"]["warehouse_location_type"]
          notes: string | null
          updated_at: string
          updated_by_user_id: string | null
          warehouse_id: string
          warehouse_zone_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          is_damaged_location?: boolean
          is_hold_location?: boolean
          is_pickable?: boolean
          is_receiving_location?: boolean
          is_shipping_location?: boolean
          is_temporary_location?: boolean
          location_code: string
          location_name?: string | null
          location_type?: Database["public"]["Enums"]["warehouse_location_type"]
          notes?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id: string
          warehouse_zone_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          is_damaged_location?: boolean
          is_hold_location?: boolean
          is_pickable?: boolean
          is_receiving_location?: boolean
          is_shipping_location?: boolean
          is_temporary_location?: boolean
          location_code?: string
          location_name?: string | null
          location_type?: Database["public"]["Enums"]["warehouse_location_type"]
          notes?: string | null
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id?: string
          warehouse_zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_location_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_location_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "warehouse_location_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_location_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "warehouse_location_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_location_warehouse_zone_id_fkey"
            columns: ["warehouse_zone_id"]
            isOneToOne: false
            referencedRelation: "warehouse_zone"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_zone: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
          updated_by_user_id: string | null
          warehouse_id: string
          zone_code: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id: string
          zone_code: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
          updated_by_user_id?: string | null
          warehouse_id?: string
          zone_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_zone_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_zone_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "warehouse_zone_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_zone_updated_by_user_id_fkey"
            columns: ["updated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "warehouse_zone_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_customer_rep_assignments: {
        Row: {
          agency_name: string | null
          assignment_source:
            | Database["public"]["Enums"]["rep_assignment_source"]
            | null
          coverage_role: Database["public"]["Enums"]["rep_coverage_role"] | null
          customer_account_id: string | null
          customer_location_id: string | null
          customer_name: string | null
          id: string | null
          location_name: string | null
          sales_rep_agency_id: string | null
          sales_rep_id: string | null
          sales_rep_name: string | null
          start_date: string | null
          territory_code: string | null
          territory_id: string | null
          territory_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_location_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_sales_rep_agency_id_fkey"
            columns: ["sales_rep_agency_id"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_sales_rep_id_fkey"
            columns: ["sales_rep_id"]
            isOneToOne: false
            referencedRelation: "sales_rep"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_location_rep_assignment_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory"
            referencedColumns: ["id"]
          },
        ]
      }
      active_impersonation_sessions: {
        Row: {
          admin_display_name: string | null
          admin_email: string | null
          admin_user_id: string | null
          expires_at: string | null
          id: string | null
          impersonated_display_name: string | null
          impersonated_email: string | null
          impersonated_user_id: string | null
          last_activity_at: string | null
          max_duration_minutes: number | null
          reason: string | null
          should_expire: boolean | null
          started_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_impersonation_session_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_impersonation_session_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_impersonation_session_impersonated_user_id_fkey"
            columns: ["impersonated_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_impersonation_session_impersonated_user_id_fkey"
            columns: ["impersonated_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      active_permission_overrides: {
        Row: {
          created_at: string | null
          created_by_user_id: string | null
          display_name: string | null
          effective_status: string | null
          email: string | null
          expires_at: string | null
          id: string | null
          is_permanent: boolean | null
          last_reviewed_at: string | null
          override_type:
            | Database["public"]["Enums"]["permission_override_type"]
            | null
          permission_area: string | null
          permission_code: string | null
          permission_id: string | null
          permission_level:
            | Database["public"]["Enums"]["permission_level"]
            | null
          reason: string | null
          review_due_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permission_override_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_override_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_permission_override_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_override_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_override_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ar_aging_open_items: {
        Row: {
          aging_bucket: string | null
          balance_due: number | null
          brand_id: string | null
          customer_account_id: string | null
          days_past_due: number | null
          due_date: string | null
          payment_terms_snapshot: string | null
          reference_number: string | null
          row_type: string | null
          sales_rep_agency_id_snapshot: string | null
          sales_rep_id_snapshot: string | null
          source_entity_id: string | null
          territory_id_snapshot: string | null
          transaction_date: string | null
        }
        Relationships: []
      }
      backordered_item_report: {
        Row: {
          brand_id_snapshot: string | null
          brand_name_snapshot: string | null
          customer_count: number | null
          incoming_quantity: number | null
          next_eta: string | null
          order_count: number | null
          product_id: string | null
          product_name_snapshot: string | null
          product_sku_snapshot: string | null
          quantity_on_hand: number | null
          total_backordered_quantity: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_line_brand_id_snapshot_fkey"
            columns: ["brand_id_snapshot"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
        ]
      }
      commission_ready_report: {
        Row: {
          agency_name: string | null
          amount_available_to_pay: number | null
          brand_id: string | null
          brand_name_snapshot: string | null
          commission_amount: number | null
          commission_base_amount: number | null
          commission_percent: number | null
          commission_snapshot_id: string | null
          commission_status:
            | Database["public"]["Enums"]["commission_snapshot_status"]
            | null
          customer_account_id: string | null
          customer_invoice_id: string | null
          customer_name_snapshot: string | null
          invoice_date: string | null
          invoice_number: string | null
          paid_amount: number | null
          sales_rep_agency_id: string | null
          sales_rep_id: string | null
          sales_rep_name: string | null
          territory_id: string | null
          territory_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_snapshot_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_sales_rep_agency_id_fkey"
            columns: ["sales_rep_agency_id"]
            isOneToOne: false
            referencedRelation: "sales_rep_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_sales_rep_id_fkey"
            columns: ["sales_rep_id"]
            isOneToOne: false
            referencedRelation: "sales_rep"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_snapshot_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_dashboard_current_snapshot: {
        Row: {
          open_invoice_balance: number | null
          open_invoice_count: number | null
          outstanding_credit_memo_amount: number | null
          overdue_invoice_balance: number | null
          overdue_invoice_count: number | null
          snapshot_date: string | null
          un_invoiced_packing_list_count: number | null
          ytd_credit_memo_amount: number | null
          ytd_credit_memo_count: number | null
          ytd_invoice_amount: number | null
          ytd_invoice_count: number | null
          ytd_paid_invoice_count: number | null
        }
        Relationships: []
      }
      generated_document_event_metadata: {
        Row: {
          action_type: string | null
          audience: Database["public"]["Enums"]["document_audience"] | null
          brand_id: string | null
          document_number: string | null
          document_template_id: string | null
          document_type: string | null
          email_send_history_id: string | null
          entity_id: string | null
          entity_type: string | null
          generated_at: string | null
          generated_by_user_id: string | null
          id: string | null
          metadata_json: Json | null
          normalized_action_type: string | null
          normalized_output_format: string | null
          output_format: string | null
          render_parameters_json: Json | null
          source_snapshot_refs_json: Json | null
          template_code: string | null
          template_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_document_event_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_document_event_document_template_id_fkey"
            columns: ["document_template_id"]
            isOneToOne: false
            referencedRelation: "document_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_document_event_email_send_history_id_fkey"
            columns: ["email_send_history_id"]
            isOneToOne: false
            referencedRelation: "email_send_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_document_event_generated_by_user_id_fkey"
            columns: ["generated_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_document_event_generated_by_user_id_fkey"
            columns: ["generated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_missing_required_mfa"
            referencedColumns: ["user_id"]
          },
        ]
      }
      inventory_sku_summary: {
        Row: {
          brand_id: string | null
          incoming_quantity: number | null
          last_movement_at: string | null
          next_incoming_eta: string | null
          non_sellable_quantity: number | null
          product_id: string | null
          product_name: string | null
          sellable_quantity: number | null
          sku: string | null
          total_quantity_allocated: number | null
          total_quantity_available: number | null
          total_quantity_on_hand: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      product_required_box_availability: {
        Row: {
          available_box_quantity: number | null
          box_label: string | null
          box_sequence: number | null
          product_id: string | null
          product_packing_box_id: string | null
          sku: string | null
        }
        Relationships: []
      }
      product_sellable_availability: {
        Row: {
          brand_id: string | null
          product_id: string | null
          product_name: string | null
          sellable_quantity: number | null
          sku: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      purchasing_dashboard_open_items: {
        Row: {
          line_count: number | null
          next_expected_ready_date: string | null
          open_quantity: number | null
          po_date: string | null
          status:
            | Database["public"]["Enums"]["vendor_purchase_order_status"]
            | null
          vendor_id: string | null
          vendor_name_snapshot: string | null
          vendor_po_number: string | null
          vendor_purchase_order_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_purchase_order_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor"
            referencedColumns: ["id"]
          },
        ]
      }
      rga_available_sales_order_lines: {
        Row: {
          available_rga_quantity: number | null
          brand_id_snapshot: string | null
          brand_name_snapshot: string | null
          customer_account_id: string | null
          customer_location_id: string | null
          customer_po_number: string | null
          previous_rga_quantity: number | null
          product_id: string | null
          product_name_snapshot: string | null
          product_sku_snapshot: string | null
          quantity_shipped: number | null
          sales_order_id: string | null
          sales_order_line_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_brand_id_snapshot_fkey"
            columns: ["brand_id_snapshot"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_sku_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_required_box_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sales_order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_sellable_availability"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sales_order_line_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "shipping_dashboard_open_queue"
            referencedColumns: ["sales_order_id"]
          },
        ]
      }
      rga_dashboard_action_queue: {
        Row: {
          action_bucket: string | null
          customer_account_id: string | null
          customer_location_id: string | null
          customer_name_snapshot: string | null
          original_customer_po_number_snapshot: string | null
          request_date: string | null
          requested_resolution_type:
            | Database["public"]["Enums"]["rga_resolution_type"]
            | null
          rga_id: string | null
          rga_number: string | null
          status: Database["public"]["Enums"]["rga_status"] | null
        }
        Insert: {
          action_bucket?: never
          customer_account_id?: string | null
          customer_location_id?: string | null
          customer_name_snapshot?: string | null
          original_customer_po_number_snapshot?: string | null
          request_date?: string | null
          requested_resolution_type?:
            | Database["public"]["Enums"]["rga_resolution_type"]
            | null
          rga_id?: string | null
          rga_number?: string | null
          status?: Database["public"]["Enums"]["rga_status"] | null
        }
        Update: {
          action_bucket?: never
          customer_account_id?: string | null
          customer_location_id?: string | null
          customer_name_snapshot?: string | null
          original_customer_po_number_snapshot?: string | null
          request_date?: string | null
          requested_resolution_type?:
            | Database["public"]["Enums"]["rga_resolution_type"]
            | null
          rga_id?: string | null
          rga_number?: string | null
          status?: Database["public"]["Enums"]["rga_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "rga_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rga_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_dashboard_open_queue: {
        Row: {
          credit_hold_status:
            | Database["public"]["Enums"]["credit_hold_status"]
            | null
          customer_account_id: string | null
          customer_location_id: string | null
          customer_name_snapshot: string | null
          customer_po_number: string | null
          open_line_count: number | null
          open_quantity: number | null
          order_date: string | null
          order_source: Database["public"]["Enums"]["sales_order_source"] | null
          order_type: Database["public"]["Enums"]["sales_order_type"] | null
          sales_order_id: string | null
          sales_order_number: string | null
          ship_to_display_name_snapshot: string | null
          shipping_readiness_status:
            | Database["public"]["Enums"]["shipping_readiness_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_customer_location_id_fkey"
            columns: ["customer_location_id"]
            isOneToOne: false
            referencedRelation: "customer_location"
            referencedColumns: ["id"]
          },
        ]
      }
      users_missing_required_mfa: {
        Row: {
          department: string | null
          display_name: string | null
          email: string | null
          mfa_enabled: boolean | null
          mfa_enforced_at: string | null
          mfa_required: boolean | null
          user_id: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          department?: string | null
          display_name?: string | null
          email?: string | null
          mfa_enabled?: boolean | null
          mfa_enforced_at?: string | null
          mfa_required?: boolean | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          department?: string | null
          display_name?: string | null
          email?: string | null
          mfa_enabled?: boolean | null
          mfa_enforced_at?: string | null
          mfa_required?: boolean | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_inventory_movement: {
        Args: {
          p_from_condition: Database["public"]["Enums"]["inventory_condition"]
          p_from_location_id: string
          p_movement_type: Database["public"]["Enums"]["inventory_movement_type"]
          p_notes?: string
          p_performed_by_user_id: string
          p_product_id: string
          p_product_packing_box_id: string
          p_quantity: number
          p_reason_code?: string
          p_source_entity_id: string
          p_source_entity_type: string
          p_to_condition: Database["public"]["Enums"]["inventory_condition"]
          p_to_location_id: string
          p_warehouse_id: string
        }
        Returns: string
      }
      confirm_freight_shipment: {
        Args: {
          p_freight_shipment_id: string
          p_released_by_user_id?: string
          p_ship_date?: string
        }
        Returns: undefined
      }
      create_invoices_from_packing_list: {
        Args: {
          p_brand_dropship_allocations?: Json
          p_brand_freight_allocations?: Json
          p_brand_tax_allocations?: Json
          p_created_by_user_id?: string
          p_invoice_date?: string
          p_packing_list_id: string
        }
        Returns: string[]
      }
      create_invoices_from_packing_list_with_terms: {
        Args: {
          p_brand_dropship_allocations: Json
          p_brand_freight_allocations: Json
          p_brand_tax_allocations: Json
          p_customer_freight_charge: number
          p_invoice_date: string
          p_packing_list_id: string
          p_payment_days: number
          p_payment_terms: string
        }
        Returns: string[]
      }
      generate_ar_adjustment_number: { Args: never; Returns: string }
      generate_commission_payment_number: { Args: never; Returns: string }
      generate_credit_memo_number_for_brand: {
        Args: { target_brand_id: string }
        Returns: string
      }
      generate_customer_account_number: { Args: never; Returns: string }
      generate_customer_location_code: { Args: never; Returns: string }
      generate_factory_inspection_number: { Args: never; Returns: string }
      generate_freight_shipment_number: { Args: never; Returns: string }
      generate_inventory_adjustment_number: { Args: never; Returns: string }
      generate_invoice_number_for_brand: {
        Args: { target_brand_id: string }
        Returns: string
      }
      generate_packing_list_number: { Args: never; Returns: string }
      generate_payment_number_for_brand: {
        Args: { target_brand_id: string }
        Returns: string
      }
      generate_payment_reminder_number: { Args: never; Returns: string }
      generate_prefixed_daily_number: {
        Args: { prefix: string; target_column: string; target_table: string }
        Returns: string
      }
      generate_receiving_number: { Args: never; Returns: string }
      generate_rga_number: { Args: never; Returns: string }
      generate_sales_order_number: { Args: never; Returns: string }
      generate_statement_number: { Args: never; Returns: string }
      generate_vendor_number: { Args: never; Returns: string }
      generate_vendor_po_number: { Args: never; Returns: string }
      post_commission_ar_offset: {
        Args: { p_commission_ar_offset_id: string }
        Returns: undefined
      }
      post_receiving_record: {
        Args: { p_posted_by_user_id?: string; p_receiving_record_id: string }
        Returns: undefined
      }
      post_shipment_adjustment: {
        Args: { p_shipment_adjustment_id: string }
        Returns: undefined
      }
      record_customer_payment_for_invoice: {
        Args: {
          p_amount: number
          p_customer_invoice_id: string
          p_memo?: string
          p_payment_date: string
          p_payment_method: Database["public"]["Enums"]["customer_payment_method"]
          p_recorded_by_user_id?: string
          p_reference_number?: string
        }
        Returns: string
      }
      record_invoice_settlement_with_credit_memo: {
        Args: {
          p_credit_memo_amount?: number
          p_credit_memo_id?: string
          p_customer_invoice_id: string
          p_customer_payment_amount?: number
          p_memo?: string
          p_payment_date: string
          p_payment_method: Database["public"]["Enums"]["customer_payment_method"]
          p_recorded_by_user_id?: string
          p_reference_number?: string
        }
        Returns: Json
      }
      record_invoice_settlement_with_waiver: {
        Args: {
          p_credit_memo_amount?: number
          p_credit_memo_id?: string
          p_customer_invoice_id: string
          p_customer_payment_amount?: number
          p_memo?: string
          p_payment_date: string
          p_payment_method: Database["public"]["Enums"]["customer_payment_method"]
          p_recorded_by_user_id?: string
          p_reference_number?: string
          p_waiver_amount?: number
          p_waiver_reason?: string
        }
        Returns: Json
      }
      receive_rga_return: {
        Args: {
          p_inventory_condition?: Database["public"]["Enums"]["inventory_condition"]
          p_notes?: string
          p_product_packing_box_id?: string
          p_quantity_received: number
          p_received_by_user_id?: string
          p_rga_line_id: string
          p_warehouse_id: string
          p_warehouse_location_id: string
        }
        Returns: string
      }
      refresh_commission_snapshot_paid_amount: {
        Args: { target_commission_snapshot_id: string }
        Returns: undefined
      }
      refresh_credit_memo_amount_applied: {
        Args: { target_credit_memo_id: string }
        Returns: undefined
      }
      refresh_customer_invoice_subtotal: {
        Args: { target_invoice_id: string }
        Returns: undefined
      }
      refresh_invoice_ar_totals: {
        Args: { target_invoice_id: string }
        Returns: undefined
      }
      refresh_payment_amount_applied: {
        Args: { target_payment_id: string }
        Returns: undefined
      }
      refresh_sales_order_after_shipping: {
        Args: { target_sales_order_id: string }
        Returns: undefined
      }
      refresh_sales_order_subtotal: {
        Args: { target_sales_order_id: string }
        Returns: undefined
      }
      release_freight_shipment: {
        Args: {
          p_freight_shipment_id: string
          p_released_by_user_id?: string
          p_ship_date?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      admin_security_event_type:
        | "login"
        | "logout"
        | "mfa_challenge"
        | "mfa_enrolled"
        | "mfa_disabled"
        | "impersonation_started"
        | "impersonation_ended"
        | "permission_override_created"
        | "permission_override_reviewed"
        | "permission_override_revoked"
        | "setting_changed"
        | "role_changed"
        | "user_disabled"
        | "user_enabled"
      ar_adjustment_status: "draft" | "posted" | "reversed"
      ar_adjustment_type:
        | "waive"
        | "write_off"
        | "rounding"
        | "dispute"
        | "other"
      commission_ownership_rule: "territory" | "manual" | "customer_location"
      commission_payment_status: "draft" | "posted" | "voided"
      commission_payment_type: "ach" | "check" | "cash" | "other"
      commission_snapshot_status:
        | "not_ready"
        | "commission_ready"
        | "paid"
        | "void"
      commission_status:
        | "no_commission"
        | "not_ready"
        | "commission_ready"
        | "paid"
      container_customs_status: "pending" | "filed" | "released" | "hold"
      credit_hold_reason:
        | "credit_limit_exceeded"
        | "manual_release_after_prepay"
        | "paid_down"
        | "other"
      credit_hold_status: "none" | "on_credit_hold" | "released"
      credit_limit_source: "system_default" | "customer_override"
      credit_memo_application_source_type:
        | "payment_entry"
        | "manual_apply"
        | "statement_adjustment"
      credit_memo_reason_code:
        | "return"
        | "defect"
        | "freight"
        | "adjustment"
        | "other"
      credit_memo_status:
        | "draft"
        | "pending_approval"
        | "posted"
        | "partially_applied"
        | "fully_applied"
        | "void"
      customer_account_status:
        | "pending"
        | "active"
        | "inactive"
        | "credit_hold"
        | "obsolete"
      customer_invoice_generation_mode: "brand_specific_invoice"
      customer_invoice_payment_status: "unpaid" | "partially_paid" | "paid"
      customer_invoice_status:
        | "draft"
        | "open"
        | "closed"
        | "void"
        | "written_off"
      customer_location_status: "active" | "inactive"
      customer_location_type:
        | "ship_to"
        | "showroom"
        | "ecommerce_platform"
        | "billing"
        | "warehouse"
        | "job_site"
        | "other"
      customer_payment_method:
        | "check"
        | "ach"
        | "wire"
        | "credit_card"
        | "cash"
        | "other"
      customer_payment_status:
        | "draft"
        | "posted"
        | "partially_applied"
        | "fully_applied"
        | "voided"
      customer_statement_brand_scope: "all_brands" | "single_brand"
      customer_statement_line_type:
        | "invoice"
        | "payment"
        | "credit_memo"
        | "adjustment"
        | "unapplied_payment"
      customer_statement_type: "open_only" | "full_activity"
      dashboard_code:
        | "customer_account"
        | "primary_showroom"
        | "warehouse_shipping"
        | "financial"
        | "rga"
        | "purchasing_receiving"
        | "reps_commissions"
        | "product_market_analysis"
      dashboard_widget_type:
        | "metric"
        | "queue"
        | "table"
        | "chart"
        | "alert"
        | "link_list"
      defect_severity: "emergency" | "critical" | "high" | "medium" | "low"
      defect_status:
        | "open"
        | "in_progress"
        | "ready_for_retest"
        | "closed"
        | "deferred"
      delivery_method: "email" | "print" | "both"
      display_order_type:
        | "primary_showroom_display"
        | "non_primary_display"
        | "other_display"
      document_action_type: "preview" | "download" | "email" | "regenerate"
      document_audience: "customer" | "vendor" | "internal" | "rep"
      document_output_format: "pdf" | "xlsx" | "csv" | "html"
      document_recipient_source:
        | "billing_email"
        | "order_contact_snapshot"
        | "vendor_contact"
        | "showroom_contact"
        | "manual_entry"
      document_template_scope:
        | "brand_specific"
        | "combined_brand"
        | "brand_neutral"
      factory_inspection_status:
        | "draft"
        | "passed"
        | "failed"
        | "partial"
        | "needs_review"
      freight_shipment_status:
        | "pending"
        | "in_progress"
        | "shipped"
        | "delivered"
        | "cancelled"
      freight_terms:
        | "prepaid"
        | "collect"
        | "customer_pickup"
        | "free_freight"
        | "manual_review"
        | "flat_rate"
      impersonation_status: "active" | "ended" | "expired"
      import_container_status:
        | "draft"
        | "booked"
        | "on_water"
        | "arrived"
        | "delivered"
        | "partially_received"
        | "received"
        | "closed"
        | "cancelled"
      import_status:
        | "draft"
        | "running"
        | "completed_with_errors"
        | "completed"
        | "approved"
        | "cancelled"
      incoming_inventory_status:
        | "expected"
        | "in_transit"
        | "received"
        | "closed"
        | "cancelled"
      inspection_result_status: "pass" | "fail" | "na"
      inventory_adjustment_status: "draft" | "posted" | "cancelled"
      inventory_allocation_status:
        | "active"
        | "picked"
        | "shipped"
        | "released"
        | "cancelled"
      inventory_allocation_type: "on_hand" | "incoming"
      inventory_condition:
        | "regular"
        | "to_be_inspected"
        | "damaged"
        | "hold"
        | "demolished_trash"
      inventory_movement_type:
        | "receive"
        | "putaway"
        | "ship"
        | "transfer"
        | "adjust"
        | "rga_return"
        | "rga_disposition"
        | "scrap"
      invoice_email_status: "not_sent" | "sent" | "failed"
      invoice_generation_status:
        | "not_invoiced"
        | "partially_invoiced_by_brand"
        | "fully_invoiced_by_brand"
        | "not_required"
      packing_list_status:
        | "draft"
        | "released"
        | "shipped"
        | "invoiced"
        | "cancelled"
      partner_datasheet_file_format: "xlsx" | "csv"
      payment_application_status: "posted" | "reversed"
      payment_reminder_status: "draft" | "sent" | "failed"
      permission_level:
        | "none"
        | "view"
        | "create"
        | "edit"
        | "approve_post"
        | "void"
        | "admin"
      permission_override_status: "active" | "expired" | "revoked"
      permission_override_type: "add" | "restrict" | "deny"
      primary_showroom_status:
        | "pending"
        | "active"
        | "pending_renew"
        | "expired"
        | "cancelled"
        | "suspended"
      product_customer_eligibility_tag:
        | "all"
        | "ecommerce_only"
        | "non_ecommerce_only"
        | "exclusive"
      product_document_type:
        | "spec_sheet"
        | "installation_instruction"
        | "manual"
        | "other"
      product_eligibility_rule_type: "include" | "exclude" | "exclusive"
      product_image_category:
        | "stock"
        | "detail"
        | "lifestyle"
        | "drawing"
        | "other"
      product_lifecycle_status:
        | "pending"
        | "active"
        | "inactive"
        | "discontinued"
        | "deleted"
      product_sellability_status:
        | "sellable"
        | "hidden"
        | "blocked"
        | "override_required"
      qa_status: "planned" | "in_progress" | "passed" | "failed" | "accepted"
      receiving_line_source_type:
        | "vendor_po_line"
        | "container_line"
        | "rga_line"
      receiving_source_type: "vendor_po" | "container" | "rga_return"
      receiving_status: "draft" | "posted" | "cancelled"
      record_import_status: "success" | "warning" | "failed" | "skipped"
      rep_ach_payment_status: "not_set" | "pending" | "active"
      rep_assignment_source: "territory" | "manual" | "override"
      rep_assignment_status: "active" | "inactive"
      rep_coverage_role: "primary" | "secondary" | "support" | "manager"
      report_export_status:
        | "queued"
        | "running"
        | "completed"
        | "failed"
        | "cancelled"
      report_output_format: "screen" | "pdf" | "xlsx" | "csv"
      report_shared_scope: "personal" | "role" | "department" | "global"
      report_type:
        | "customer"
        | "order"
        | "shipping"
        | "inventory"
        | "purchasing"
        | "receiving"
        | "invoice"
        | "ar"
        | "credit_memo"
        | "rga"
        | "product_performance"
        | "market_analysis"
        | "commission"
        | "migration"
        | "admin"
      rga_defective_item_disposition:
        | "return_back"
        | "field_demolish"
        | "customer_keeps"
        | "hold"
      rga_inventory_disposition:
        | "restock"
        | "hold"
        | "damaged"
        | "scrap"
        | "vendor_claim"
      rga_line_status:
        | "open"
        | "authorized"
        | "awaiting_return"
        | "received"
        | "credited"
        | "replaced"
        | "closed"
        | "cancelled"
      rga_reason_category:
        | "buy_remorse"
        | "product_defect"
        | "freight_damage"
        | "wrong_item"
        | "shipping_error"
        | "other"
      rga_replacement_freight_policy:
        | "company_paid"
        | "customer_paid"
        | "no_charge"
        | "case_by_case"
      rga_replacement_order_status:
        | "pending"
        | "ordered"
        | "partially_shipped"
        | "shipped"
        | "closed"
        | "cancelled"
      rga_resolution_type: "credit" | "replacement"
      rga_status:
        | "draft"
        | "pending_review"
        | "authorized"
        | "awaiting_return"
        | "received"
        | "awaiting_credit_memo"
        | "resolved"
        | "closed"
        | "cancelled"
        | "rejected"
      sales_order_document_action: "previewed" | "downloaded" | "emailed"
      sales_order_document_type: "order_acknowledgement" | "pro_forma_invoice"
      sales_order_line_status:
        | "open"
        | "partial"
        | "shipped"
        | "backordered"
        | "cancelled"
      sales_order_ship_to_type: "saved_location" | "dropship"
      sales_order_source:
        | "email"
        | "fax"
        | "phone"
        | "manual"
        | "portal"
        | "ecommerce"
        | "rep_submitted"
        | "converted"
      sales_order_status:
        | "draft"
        | "open"
        | "partially_shipped"
        | "shipped"
        | "closed"
        | "cancelled"
        | "deleted"
        | "converted"
        | "pending"
        | "hold"
        | "void"
      sales_order_type:
        | "regular"
        | "display"
        | "rga_replacement"
        | "catalog_marketing"
        | "other"
        | "quote"
      sales_rep_agency_status: "active" | "inactive"
      sales_rep_status: "active" | "inactive"
      scheduled_report_frequency: "daily" | "weekly" | "monthly"
      scheduled_report_status: "active" | "paused" | "error" | "disabled"
      shipment_adjustment_status: "posted" | "reversed"
      shipping_priority: "normal" | "highest"
      shipping_readiness_status:
        | "not_ready"
        | "ready"
        | "partially_ready"
        | "hold"
      shipping_type:
        | "ltl"
        | "truck_freight"
        | "parcel"
        | "will_call"
        | "drop_ship"
      showroom_display_status:
        | "active"
        | "sold"
        | "swapped"
        | "removed"
        | "needs_refresh"
        | "expired"
      system_setting_category:
        | "security"
        | "customer"
        | "product"
        | "order"
        | "shipping"
        | "inventory"
        | "purchasing"
        | "ar"
        | "rga"
        | "reports"
        | "documents"
        | "integration"
        | "migration"
        | "general"
      territory_status: "active" | "inactive"
      user_type: "internal" | "customer_portal" | "rep_portal" | "system"
      vendor_payment_method:
        | "check"
        | "ach"
        | "wire"
        | "credit_card"
        | "cash"
        | "other"
      vendor_po_invoice_payment_status:
        | "to_be_paid"
        | "partially_paid"
        | "paid"
        | "void"
      vendor_po_submission_status: "sent" | "failed" | "printed"
      vendor_purchase_order_line_status:
        | "open"
        | "partially_received"
        | "received"
        | "closed"
        | "cancelled"
      vendor_purchase_order_status:
        | "draft"
        | "submitted"
        | "confirmed"
        | "in_production"
        | "inspected"
        | "shipped"
        | "partially_received"
        | "received"
        | "closed"
        | "cancelled"
      vendor_status: "active" | "inactive"
      warehouse_location_type:
        | "bin"
        | "receiving"
        | "hold"
        | "damaged"
        | "shipping"
        | "temporary"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_security_event_type: [
        "login",
        "logout",
        "mfa_challenge",
        "mfa_enrolled",
        "mfa_disabled",
        "impersonation_started",
        "impersonation_ended",
        "permission_override_created",
        "permission_override_reviewed",
        "permission_override_revoked",
        "setting_changed",
        "role_changed",
        "user_disabled",
        "user_enabled",
      ],
      ar_adjustment_status: ["draft", "posted", "reversed"],
      ar_adjustment_type: [
        "waive",
        "write_off",
        "rounding",
        "dispute",
        "other",
      ],
      commission_ownership_rule: ["territory", "manual", "customer_location"],
      commission_payment_status: ["draft", "posted", "voided"],
      commission_payment_type: ["ach", "check", "cash", "other"],
      commission_snapshot_status: [
        "not_ready",
        "commission_ready",
        "paid",
        "void",
      ],
      commission_status: [
        "no_commission",
        "not_ready",
        "commission_ready",
        "paid",
      ],
      container_customs_status: ["pending", "filed", "released", "hold"],
      credit_hold_reason: [
        "credit_limit_exceeded",
        "manual_release_after_prepay",
        "paid_down",
        "other",
      ],
      credit_hold_status: ["none", "on_credit_hold", "released"],
      credit_limit_source: ["system_default", "customer_override"],
      credit_memo_application_source_type: [
        "payment_entry",
        "manual_apply",
        "statement_adjustment",
      ],
      credit_memo_reason_code: [
        "return",
        "defect",
        "freight",
        "adjustment",
        "other",
      ],
      credit_memo_status: [
        "draft",
        "pending_approval",
        "posted",
        "partially_applied",
        "fully_applied",
        "void",
      ],
      customer_account_status: [
        "pending",
        "active",
        "inactive",
        "credit_hold",
        "obsolete",
      ],
      customer_invoice_generation_mode: ["brand_specific_invoice"],
      customer_invoice_payment_status: ["unpaid", "partially_paid", "paid"],
      customer_invoice_status: [
        "draft",
        "open",
        "closed",
        "void",
        "written_off",
      ],
      customer_location_status: ["active", "inactive"],
      customer_location_type: [
        "ship_to",
        "showroom",
        "ecommerce_platform",
        "billing",
        "warehouse",
        "job_site",
        "other",
      ],
      customer_payment_method: [
        "check",
        "ach",
        "wire",
        "credit_card",
        "cash",
        "other",
      ],
      customer_payment_status: [
        "draft",
        "posted",
        "partially_applied",
        "fully_applied",
        "voided",
      ],
      customer_statement_brand_scope: ["all_brands", "single_brand"],
      customer_statement_line_type: [
        "invoice",
        "payment",
        "credit_memo",
        "adjustment",
        "unapplied_payment",
      ],
      customer_statement_type: ["open_only", "full_activity"],
      dashboard_code: [
        "customer_account",
        "primary_showroom",
        "warehouse_shipping",
        "financial",
        "rga",
        "purchasing_receiving",
        "reps_commissions",
        "product_market_analysis",
      ],
      dashboard_widget_type: [
        "metric",
        "queue",
        "table",
        "chart",
        "alert",
        "link_list",
      ],
      defect_severity: ["emergency", "critical", "high", "medium", "low"],
      defect_status: [
        "open",
        "in_progress",
        "ready_for_retest",
        "closed",
        "deferred",
      ],
      delivery_method: ["email", "print", "both"],
      display_order_type: [
        "primary_showroom_display",
        "non_primary_display",
        "other_display",
      ],
      document_action_type: ["preview", "download", "email", "regenerate"],
      document_audience: ["customer", "vendor", "internal", "rep"],
      document_output_format: ["pdf", "xlsx", "csv", "html"],
      document_recipient_source: [
        "billing_email",
        "order_contact_snapshot",
        "vendor_contact",
        "showroom_contact",
        "manual_entry",
      ],
      document_template_scope: [
        "brand_specific",
        "combined_brand",
        "brand_neutral",
      ],
      factory_inspection_status: [
        "draft",
        "passed",
        "failed",
        "partial",
        "needs_review",
      ],
      freight_shipment_status: [
        "pending",
        "in_progress",
        "shipped",
        "delivered",
        "cancelled",
      ],
      freight_terms: [
        "prepaid",
        "collect",
        "customer_pickup",
        "free_freight",
        "manual_review",
        "flat_rate",
      ],
      impersonation_status: ["active", "ended", "expired"],
      import_container_status: [
        "draft",
        "booked",
        "on_water",
        "arrived",
        "delivered",
        "partially_received",
        "received",
        "closed",
        "cancelled",
      ],
      import_status: [
        "draft",
        "running",
        "completed_with_errors",
        "completed",
        "approved",
        "cancelled",
      ],
      incoming_inventory_status: [
        "expected",
        "in_transit",
        "received",
        "closed",
        "cancelled",
      ],
      inspection_result_status: ["pass", "fail", "na"],
      inventory_adjustment_status: ["draft", "posted", "cancelled"],
      inventory_allocation_status: [
        "active",
        "picked",
        "shipped",
        "released",
        "cancelled",
      ],
      inventory_allocation_type: ["on_hand", "incoming"],
      inventory_condition: [
        "regular",
        "to_be_inspected",
        "damaged",
        "hold",
        "demolished_trash",
      ],
      inventory_movement_type: [
        "receive",
        "putaway",
        "ship",
        "transfer",
        "adjust",
        "rga_return",
        "rga_disposition",
        "scrap",
      ],
      invoice_email_status: ["not_sent", "sent", "failed"],
      invoice_generation_status: [
        "not_invoiced",
        "partially_invoiced_by_brand",
        "fully_invoiced_by_brand",
        "not_required",
      ],
      packing_list_status: [
        "draft",
        "released",
        "shipped",
        "invoiced",
        "cancelled",
      ],
      partner_datasheet_file_format: ["xlsx", "csv"],
      payment_application_status: ["posted", "reversed"],
      payment_reminder_status: ["draft", "sent", "failed"],
      permission_level: [
        "none",
        "view",
        "create",
        "edit",
        "approve_post",
        "void",
        "admin",
      ],
      permission_override_status: ["active", "expired", "revoked"],
      permission_override_type: ["add", "restrict", "deny"],
      primary_showroom_status: [
        "pending",
        "active",
        "pending_renew",
        "expired",
        "cancelled",
        "suspended",
      ],
      product_customer_eligibility_tag: [
        "all",
        "ecommerce_only",
        "non_ecommerce_only",
        "exclusive",
      ],
      product_document_type: [
        "spec_sheet",
        "installation_instruction",
        "manual",
        "other",
      ],
      product_eligibility_rule_type: ["include", "exclude", "exclusive"],
      product_image_category: [
        "stock",
        "detail",
        "lifestyle",
        "drawing",
        "other",
      ],
      product_lifecycle_status: [
        "pending",
        "active",
        "inactive",
        "discontinued",
        "deleted",
      ],
      product_sellability_status: [
        "sellable",
        "hidden",
        "blocked",
        "override_required",
      ],
      qa_status: ["planned", "in_progress", "passed", "failed", "accepted"],
      receiving_line_source_type: [
        "vendor_po_line",
        "container_line",
        "rga_line",
      ],
      receiving_source_type: ["vendor_po", "container", "rga_return"],
      receiving_status: ["draft", "posted", "cancelled"],
      record_import_status: ["success", "warning", "failed", "skipped"],
      rep_ach_payment_status: ["not_set", "pending", "active"],
      rep_assignment_source: ["territory", "manual", "override"],
      rep_assignment_status: ["active", "inactive"],
      rep_coverage_role: ["primary", "secondary", "support", "manager"],
      report_export_status: [
        "queued",
        "running",
        "completed",
        "failed",
        "cancelled",
      ],
      report_output_format: ["screen", "pdf", "xlsx", "csv"],
      report_shared_scope: ["personal", "role", "department", "global"],
      report_type: [
        "customer",
        "order",
        "shipping",
        "inventory",
        "purchasing",
        "receiving",
        "invoice",
        "ar",
        "credit_memo",
        "rga",
        "product_performance",
        "market_analysis",
        "commission",
        "migration",
        "admin",
      ],
      rga_defective_item_disposition: [
        "return_back",
        "field_demolish",
        "customer_keeps",
        "hold",
      ],
      rga_inventory_disposition: [
        "restock",
        "hold",
        "damaged",
        "scrap",
        "vendor_claim",
      ],
      rga_line_status: [
        "open",
        "authorized",
        "awaiting_return",
        "received",
        "credited",
        "replaced",
        "closed",
        "cancelled",
      ],
      rga_reason_category: [
        "buy_remorse",
        "product_defect",
        "freight_damage",
        "wrong_item",
        "shipping_error",
        "other",
      ],
      rga_replacement_freight_policy: [
        "company_paid",
        "customer_paid",
        "no_charge",
        "case_by_case",
      ],
      rga_replacement_order_status: [
        "pending",
        "ordered",
        "partially_shipped",
        "shipped",
        "closed",
        "cancelled",
      ],
      rga_resolution_type: ["credit", "replacement"],
      rga_status: [
        "draft",
        "pending_review",
        "authorized",
        "awaiting_return",
        "received",
        "awaiting_credit_memo",
        "resolved",
        "closed",
        "cancelled",
        "rejected",
      ],
      sales_order_document_action: ["previewed", "downloaded", "emailed"],
      sales_order_document_type: ["order_acknowledgement", "pro_forma_invoice"],
      sales_order_line_status: [
        "open",
        "partial",
        "shipped",
        "backordered",
        "cancelled",
      ],
      sales_order_ship_to_type: ["saved_location", "dropship"],
      sales_order_source: [
        "email",
        "fax",
        "phone",
        "manual",
        "portal",
        "ecommerce",
        "rep_submitted",
        "converted",
      ],
      sales_order_status: [
        "draft",
        "open",
        "partially_shipped",
        "shipped",
        "closed",
        "cancelled",
        "deleted",
        "converted",
        "pending",
        "hold",
        "void",
      ],
      sales_order_type: [
        "regular",
        "display",
        "rga_replacement",
        "catalog_marketing",
        "other",
        "quote",
      ],
      sales_rep_agency_status: ["active", "inactive"],
      sales_rep_status: ["active", "inactive"],
      scheduled_report_frequency: ["daily", "weekly", "monthly"],
      scheduled_report_status: ["active", "paused", "error", "disabled"],
      shipment_adjustment_status: ["posted", "reversed"],
      shipping_priority: ["normal", "highest"],
      shipping_readiness_status: [
        "not_ready",
        "ready",
        "partially_ready",
        "hold",
      ],
      shipping_type: [
        "ltl",
        "truck_freight",
        "parcel",
        "will_call",
        "drop_ship",
      ],
      showroom_display_status: [
        "active",
        "sold",
        "swapped",
        "removed",
        "needs_refresh",
        "expired",
      ],
      system_setting_category: [
        "security",
        "customer",
        "product",
        "order",
        "shipping",
        "inventory",
        "purchasing",
        "ar",
        "rga",
        "reports",
        "documents",
        "integration",
        "migration",
        "general",
      ],
      territory_status: ["active", "inactive"],
      user_type: ["internal", "customer_portal", "rep_portal", "system"],
      vendor_payment_method: [
        "check",
        "ach",
        "wire",
        "credit_card",
        "cash",
        "other",
      ],
      vendor_po_invoice_payment_status: [
        "to_be_paid",
        "partially_paid",
        "paid",
        "void",
      ],
      vendor_po_submission_status: ["sent", "failed", "printed"],
      vendor_purchase_order_line_status: [
        "open",
        "partially_received",
        "received",
        "closed",
        "cancelled",
      ],
      vendor_purchase_order_status: [
        "draft",
        "submitted",
        "confirmed",
        "in_production",
        "inspected",
        "shipped",
        "partially_received",
        "received",
        "closed",
        "cancelled",
      ],
      vendor_status: ["active", "inactive"],
      warehouse_location_type: [
        "bin",
        "receiving",
        "hold",
        "damaged",
        "shipping",
        "temporary",
      ],
    },
  },
} as const
