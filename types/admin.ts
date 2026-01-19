// Admin Panel TypeScript Types

// ==================== Pagination ====================
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// ==================== Dashboard ====================
export interface UserStats {
    total: number;
    active: number;
    by_tier: {
        free: number;
        pro: number;
        lifetime: number;
    };
    new_this_month: number;
}

export interface RevenueStats {
    total: number;
    this_month: number;
    pending_payments: number;
}

export interface PortfolioStats {
    total: number;
    published: number;
}

export interface ChatStats {
    total_sessions: number;
    active_sessions: number;
    total_rag_documents: number;
}

export interface ResumeStats {
    total: number;
}

export interface DashboardStats {
    users: UserStats;
    revenue: RevenueStats;
    portfolios: PortfolioStats;
    chat: ChatStats;
    resumes: ResumeStats;
}

// ==================== Users ====================
export type UserTier = 'free' | 'pro' | 'lifetime';
export type PlanType = 'free' | 'pro_monthly' | 'lifetime';
export type AuthMethod = 'email' | 'google';

export interface AdminUser {
    id: number;
    email: string;
    name: string;
    user_tier: UserTier;
    plan_type: PlanType;
    subscription_expiry: string | null;
    authentication_method: AuthMethod;
    resume_process_count: number;
    username_change_count: number;
    is_active: boolean;
    is_staff: boolean;
    created_at: string;
    last_login: string | null;
    portfolio_username: string | null;
    // Detail view only
    portfolios_count?: number;
    payments_count?: number;
}

export interface UserUpdatePayload {
    name?: string;
    user_tier?: UserTier;
    plan_type?: PlanType;
    subscription_expiry?: string | null;
    resume_process_count?: number;
    username_change_count?: number;
    is_active?: boolean;
    is_staff?: boolean;
}

export interface UserUpgradePayload {
    tier: UserTier;
    plan_type: PlanType;
    days: number;
}

export interface ExtendSubscriptionPayload {
    days: number;
}

export interface ResetCountsPayload {
    type: 'resume' | 'username' | 'all';
}

// ==================== Payments ====================
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface AdminPayment {
    id: number;
    user: number;
    user_email: string;
    razorpay_order_id: string;
    razorpay_payment_id: string | null;
    razorpay_signature: string | null;
    plan_type: PlanType;
    amount: string;
    status: PaymentStatus;
    created_at: string;
    updated_at: string;
}

// ==================== Portfolios ====================
export interface AdminPortfolioProfile {
    id: number;
    headline: string;
    short_bio: string;
    long_bio: string;
    name?: string;
    image?: string;
    location?: string;
    availability_status?: string;
}

export interface AdminTechStackItem {
    id: number;
    tech: number;
    tech_name?: string;
    proficiency: string;
    display_order: number;
    icon_url?: string;
}

export interface AdminExperience {
    id: number;
    company: number | null;
    company_name: string;
    role: string;
    start_date: string;
    end_date: string | null;
    description: string;
    is_current: boolean;
    location?: string;
    company_logo?: string;
}

export interface AdminProject {
    id: number;
    title: string;
    description: string;
    repo_url: string | null;
    live_url: string | null;
    tech_used: number[];
    key_features: string[];
    technical_challenges: string[];
    year: string;
    project_type: string;
    image?: string;
    is_featured?: boolean;
}

export interface AdminEducation {
    id: number;
    institution: string;
    degree: string;
    field_of_study: string;
    grade: string | null;
    grade_type: 'cgpa' | 'sgpa' | 'percentage' | 'gpa' | null;
    start_date: string;
    end_date: string;
    description?: string;
    institution_logo?: string;
}

export interface AdminSocial {
    id: number;
    social_platform: number;
    platform_name?: string;
    url: string;
}

export interface PublishedSnapshot {
    id: number;
    version: number;
    is_active: boolean;
    published_at: string;
    snapshot_data?: Record<string, unknown>;
}

export interface AdminPortfolioListItem {
    id: number;
    user: number;
    user_email: string;
    title: string;
    theme: string;
    username: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminPortfolioDetail extends AdminPortfolioListItem {
    username_str: string;
    missing_tech_stack: string[];
    contact_data: Record<string, unknown>;
    public_url: string;
    profile: AdminPortfolioProfile | null;
    tech_stack: AdminTechStackItem[];
    experiences: AdminExperience[];
    projects: AdminProject[];
    education: AdminEducation[];
    socials: AdminSocial[];
    published_snapshots: PublishedSnapshot[];
}

// ==================== Registries ====================
export type IconType = 'url' | 'svg' | 'font';
export type ColorVariant = 'colored' | 'dark' | 'light';

export interface TechRegistryItem {
    id: number;
    display_name: string;
    code_name: string;
    icon_type: IconType;
    icon_path: string | null;
    icon_source_url: string | null;
    doc_url: string | null;
    color_variant: ColorVariant;
    is_verified: boolean;
}

export interface SocialRegistryItem {
    id: number;
    display_name: string;
    code_name: string;
    icon_type: IconType;
    icon_path: string | null;
    icon_source_url: string | null;
    doc_url: string | null;
    color_variant: ColorVariant;
    is_verified: boolean;
}

export interface CompanyRegistryItem {
    id: number;
    name: string;
    domain: string;
    logo_url: string | null;
    is_verified: boolean;
}

export interface UsernameItem {
    id: number;
    username: string;
    user: number;
    user_email: string;
}

export interface ReservedUsername {
    id: number;
    username: string;
    reason: string;
}

// ==================== Chat & RAG ====================
export interface AdminChatSession {
    id: number;
    session_id: string;
    user: number;
    user_email: string;
    portfolio: number;
    is_public: boolean;
    is_active: boolean;
    created_at: string;
    last_activity: string;
    ip_address: string | null;
    messages_count: number;
}

export interface ChatMessage {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export interface AdminChatSessionDetail extends AdminChatSession {
    messages: ChatMessage[];
}

export interface AdminRAGDocument {
    id: number;
    user: number;
    user_email: string;
    portfolio_version: string;
    title: string;
    text: string;
    section: string;
    source: string;
}

// ==================== Resumes ====================
export interface ProcessingStatus {
    id: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message: string | null;
}

export interface AdminResume {
    id: number;
    user: number;
    user_email: string;
    original_filename: string;
    file: string;
    profile_photo: string | null;
    extracted_text: string;
    structured_data: Record<string, unknown>;
    uploaded_at: string;
    processing_status: ProcessingStatus;
}

// ==================== Query Params ====================
export interface UserQueryParams {
    page?: number;
    page_size?: number;
    tier?: UserTier;
    is_active?: boolean;
    search?: string;
}

export interface PaymentQueryParams {
    page?: number;
    page_size?: number;
    status?: PaymentStatus;
    plan_type?: PlanType;
    user?: number;
}

export interface PortfolioQueryParams {
    page?: number;
    page_size?: number;
    user?: number;
    published?: boolean;
    search?: string;
}

export interface ChatSessionQueryParams {
    page?: number;
    page_size?: number;
    user?: number;
    is_active?: boolean;
}

export interface RAGDocumentQueryParams {
    page?: number;
    page_size?: number;
    user?: number;
    section?: string;
}

export interface ResumeQueryParams {
    page?: number;
    page_size?: number;
    user?: number;
}
