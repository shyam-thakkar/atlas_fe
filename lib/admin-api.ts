// Admin API Service
import { apiRequest } from './api';
import type {
    PaginatedResponse,
    DashboardStats,
    AdminUser,
    UserQueryParams,
    UserUpdatePayload,
    UserUpgradePayload,
    ExtendSubscriptionPayload,
    ResetCountsPayload,
    AdminPayment,
    PaymentQueryParams,
    AdminPortfolioListItem,
    AdminPortfolioDetail,
    PortfolioQueryParams,
    PublishedSnapshot,
    AdminExperience,
    AdminProject,
    AdminEducation,
    AdminTechStackItem,
    AdminSocial,
    TechRegistryItem,
    SocialRegistryItem,
    CompanyRegistryItem,
    UsernameItem,
    ReservedUsername,
    AdminChatSession,
    AdminChatSessionDetail,
    ChatSessionQueryParams,
    AdminRAGDocument,
    RAGDocumentQueryParams,
    AdminResume,
    ResumeQueryParams,
} from '@/types/admin';

const ADMIN_BASE = '/api/admin';

// ==================== Utility ====================
function buildQueryString(params: object): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
        }
    });
    const qs = searchParams.toString();
    return qs ? `?${qs}` : '';
}

// ==================== Dashboard ====================
export async function getDashboardStats(): Promise<DashboardStats> {
    return apiRequest<DashboardStats>(`${ADMIN_BASE}/dashboard/stats/`);
}

// ==================== Users ====================
export async function getUsers(params: UserQueryParams = {}): Promise<PaginatedResponse<AdminUser>> {
    return apiRequest<PaginatedResponse<AdminUser>>(`${ADMIN_BASE}/users/${buildQueryString(params)}`);
}

export async function getUser(id: number): Promise<AdminUser> {
    return apiRequest<AdminUser>(`${ADMIN_BASE}/users/${id}/`);
}

export async function updateUser(id: number, data: UserUpdatePayload): Promise<AdminUser> {
    return apiRequest<AdminUser>(`${ADMIN_BASE}/users/${id}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function upgradeUser(id: number, data: UserUpgradePayload): Promise<AdminUser> {
    return apiRequest<AdminUser>(`${ADMIN_BASE}/users/${id}/upgrade/`, {
        method: 'POST',
        body: data,
    });
}

export async function extendSubscription(id: number, data: ExtendSubscriptionPayload): Promise<{ message: string; new_expiry: string }> {
    return apiRequest(`${ADMIN_BASE}/users/${id}/extend_subscription/`, {
        method: 'POST',
        body: data,
    });
}

export async function resetUserCounts(id: number, data: ResetCountsPayload): Promise<{ message: string }> {
    return apiRequest(`${ADMIN_BASE}/users/${id}/reset_counts/`, {
        method: 'POST',
        body: data,
    });
}

// ==================== Payments ====================
export async function getPayments(params: PaymentQueryParams = {}): Promise<PaginatedResponse<AdminPayment>> {
    return apiRequest<PaginatedResponse<AdminPayment>>(`${ADMIN_BASE}/payments/${buildQueryString(params)}`);
}

export async function updatePayment(id: number, data: { status: string }): Promise<AdminPayment> {
    return apiRequest<AdminPayment>(`${ADMIN_BASE}/payments/${id}/`, {
        method: 'PATCH',
        body: data,
    });
}

// ==================== Portfolios ====================
export async function getPortfolios(params: PortfolioQueryParams = {}): Promise<PaginatedResponse<AdminPortfolioListItem>> {
    return apiRequest<PaginatedResponse<AdminPortfolioListItem>>(`${ADMIN_BASE}/portfolios/${buildQueryString(params)}`);
}

export async function getPortfolio(id: number): Promise<AdminPortfolioDetail> {
    return apiRequest<AdminPortfolioDetail>(`${ADMIN_BASE}/portfolios/${id}/`);
}

export async function updatePortfolio(id: number, data: Partial<AdminPortfolioDetail>): Promise<AdminPortfolioDetail> {
    return apiRequest<AdminPortfolioDetail>(`${ADMIN_BASE}/portfolios/${id}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function unpublishPortfolio(id: number): Promise<{ message: string }> {
    return apiRequest(`${ADMIN_BASE}/portfolios/${id}/unpublish/`, {
        method: 'POST',
    });
}

// ==================== Portfolio Snapshots ====================
export async function getSnapshots(portfolioId: number): Promise<PublishedSnapshot[]> {
    return apiRequest<PublishedSnapshot[]>(`${ADMIN_BASE}/portfolios/${portfolioId}/snapshots/`);
}

export async function activateSnapshot(portfolioId: number, snapshotId: number): Promise<{ message: string }> {
    return apiRequest(`${ADMIN_BASE}/portfolios/${portfolioId}/snapshots/${snapshotId}/activate/`, {
        method: 'POST',
    });
}

export async function deleteSnapshot(portfolioId: number, snapshotId: number): Promise<{ message: string }> {
    return apiRequest(`${ADMIN_BASE}/portfolios/${portfolioId}/snapshots/${snapshotId}/`, {
        method: 'DELETE',
    });
}

// ==================== Portfolio Sub-Resources ====================
// Experiences
export async function getExperiences(portfolioId: number): Promise<AdminExperience[]> {
    return apiRequest<AdminExperience[]>(`${ADMIN_BASE}/portfolios/${portfolioId}/experiences/`);
}

export async function createExperience(portfolioId: number, data: Omit<AdminExperience, 'id'>): Promise<AdminExperience> {
    return apiRequest<AdminExperience>(`${ADMIN_BASE}/portfolios/${portfolioId}/experiences/`, {
        method: 'POST',
        body: data,
    });
}

export async function updateExperience(portfolioId: number, expId: number, data: Partial<AdminExperience>): Promise<AdminExperience> {
    return apiRequest<AdminExperience>(`${ADMIN_BASE}/portfolios/${portfolioId}/experiences/${expId}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteExperience(portfolioId: number, expId: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/portfolios/${portfolioId}/experiences/${expId}/`, {
        method: 'DELETE',
    });
}

// Projects
export async function getProjects(portfolioId: number): Promise<AdminProject[]> {
    return apiRequest<AdminProject[]>(`${ADMIN_BASE}/portfolios/${portfolioId}/projects/`);
}

export async function createProject(portfolioId: number, data: Omit<AdminProject, 'id'>): Promise<AdminProject> {
    return apiRequest<AdminProject>(`${ADMIN_BASE}/portfolios/${portfolioId}/projects/`, {
        method: 'POST',
        body: data,
    });
}

export async function updateProject(portfolioId: number, projectId: number, data: Partial<AdminProject>): Promise<AdminProject> {
    return apiRequest<AdminProject>(`${ADMIN_BASE}/portfolios/${portfolioId}/projects/${projectId}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteProject(portfolioId: number, projectId: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/portfolios/${portfolioId}/projects/${projectId}/`, {
        method: 'DELETE',
    });
}

// Education
export async function getEducation(portfolioId: number): Promise<AdminEducation[]> {
    return apiRequest<AdminEducation[]>(`${ADMIN_BASE}/portfolios/${portfolioId}/education/`);
}

export async function createEducation(portfolioId: number, data: Omit<AdminEducation, 'id'>): Promise<AdminEducation> {
    return apiRequest<AdminEducation>(`${ADMIN_BASE}/portfolios/${portfolioId}/education/`, {
        method: 'POST',
        body: data,
    });
}

export async function updateEducation(portfolioId: number, eduId: number, data: Partial<AdminEducation>): Promise<AdminEducation> {
    return apiRequest<AdminEducation>(`${ADMIN_BASE}/portfolios/${portfolioId}/education/${eduId}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteEducation(portfolioId: number, eduId: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/portfolios/${portfolioId}/education/${eduId}/`, {
        method: 'DELETE',
    });
}

// Tech Stack
export async function getTechStack(portfolioId: number): Promise<AdminTechStackItem[]> {
    return apiRequest<AdminTechStackItem[]>(`${ADMIN_BASE}/portfolios/${portfolioId}/tech-stack/`);
}

export async function createTechStack(portfolioId: number, data: Omit<AdminTechStackItem, 'id'>): Promise<AdminTechStackItem> {
    return apiRequest<AdminTechStackItem>(`${ADMIN_BASE}/portfolios/${portfolioId}/tech-stack/`, {
        method: 'POST',
        body: data,
    });
}

export async function updateTechStack(portfolioId: number, techId: number, data: Partial<AdminTechStackItem>): Promise<AdminTechStackItem> {
    return apiRequest<AdminTechStackItem>(`${ADMIN_BASE}/portfolios/${portfolioId}/tech-stack/${techId}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteTechStack(portfolioId: number, techId: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/portfolios/${portfolioId}/tech-stack/${techId}/`, {
        method: 'DELETE',
    });
}

// Socials
export async function getSocials(portfolioId: number): Promise<AdminSocial[]> {
    return apiRequest<AdminSocial[]>(`${ADMIN_BASE}/portfolios/${portfolioId}/socials/`);
}

export async function createSocial(portfolioId: number, data: Omit<AdminSocial, 'id'>): Promise<AdminSocial> {
    return apiRequest<AdminSocial>(`${ADMIN_BASE}/portfolios/${portfolioId}/socials/`, {
        method: 'POST',
        body: data,
    });
}

export async function updateSocial(portfolioId: number, socialId: number, data: Partial<AdminSocial>): Promise<AdminSocial> {
    return apiRequest<AdminSocial>(`${ADMIN_BASE}/portfolios/${portfolioId}/socials/${socialId}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteSocial(portfolioId: number, socialId: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/portfolios/${portfolioId}/socials/${socialId}/`, {
        method: 'DELETE',
    });
}

// ==================== Registries ====================
// Tech Registry
export async function getTechRegistry(): Promise<TechRegistryItem[]> {
    const response = await apiRequest<TechRegistryItem[] | { results: TechRegistryItem[] }>(`${ADMIN_BASE}/tech-registry/`);
    return Array.isArray(response) ? response : response.results || [];
}

export async function createTechRegistryItem(data: Omit<TechRegistryItem, 'id'>): Promise<TechRegistryItem> {
    return apiRequest<TechRegistryItem>(`${ADMIN_BASE}/tech-registry/`, {
        method: 'POST',
        body: data,
    });
}

export async function updateTechRegistryItem(id: number, data: Partial<TechRegistryItem>): Promise<TechRegistryItem> {
    return apiRequest<TechRegistryItem>(`${ADMIN_BASE}/tech-registry/${id}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteTechRegistryItem(id: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/tech-registry/${id}/`, {
        method: 'DELETE',
    });
}

// Social Registry
export async function getSocialRegistry(): Promise<SocialRegistryItem[]> {
    const response = await apiRequest<SocialRegistryItem[] | { results: SocialRegistryItem[] }>(`${ADMIN_BASE}/social-registry/`);
    return Array.isArray(response) ? response : response.results || [];
}

export async function createSocialRegistryItem(data: Omit<SocialRegistryItem, 'id'>): Promise<SocialRegistryItem> {
    return apiRequest<SocialRegistryItem>(`${ADMIN_BASE}/social-registry/`, {
        method: 'POST',
        body: data,
    });
}

export async function updateSocialRegistryItem(id: number, data: Partial<SocialRegistryItem>): Promise<SocialRegistryItem> {
    return apiRequest<SocialRegistryItem>(`${ADMIN_BASE}/social-registry/${id}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteSocialRegistryItem(id: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/social-registry/${id}/`, {
        method: 'DELETE',
    });
}

// Company Registry
export async function getCompanyRegistry(): Promise<CompanyRegistryItem[]> {
    const response = await apiRequest<CompanyRegistryItem[] | { results: CompanyRegistryItem[] }>(`${ADMIN_BASE}/company-registry/`);
    return Array.isArray(response) ? response : response.results || [];
}

export async function createCompanyRegistryItem(data: Omit<CompanyRegistryItem, 'id'>): Promise<CompanyRegistryItem> {
    return apiRequest<CompanyRegistryItem>(`${ADMIN_BASE}/company-registry/`, {
        method: 'POST',
        body: data,
    });
}

export async function updateCompanyRegistryItem(id: number, data: Partial<CompanyRegistryItem>): Promise<CompanyRegistryItem> {
    return apiRequest<CompanyRegistryItem>(`${ADMIN_BASE}/company-registry/${id}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteCompanyRegistryItem(id: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/company-registry/${id}/`, {
        method: 'DELETE',
    });
}

// Usernames
export async function getUsernames(): Promise<UsernameItem[]> {
    const response = await apiRequest<UsernameItem[] | { results: UsernameItem[] }>(`${ADMIN_BASE}/usernames/`);
    return Array.isArray(response) ? response : response.results || [];
}

export async function deleteUsername(id: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/usernames/${id}/`, {
        method: 'DELETE',
    });
}

// Reserved Usernames
export async function getReservedUsernames(): Promise<ReservedUsername[]> {
    const response = await apiRequest<ReservedUsername[] | { results: ReservedUsername[] }>(`${ADMIN_BASE}/reserved-usernames/`);
    return Array.isArray(response) ? response : response.results || [];
}

export async function createReservedUsername(data: Omit<ReservedUsername, 'id'>): Promise<ReservedUsername> {
    return apiRequest<ReservedUsername>(`${ADMIN_BASE}/reserved-usernames/`, {
        method: 'POST',
        body: data,
    });
}

export async function updateReservedUsername(id: number, data: Partial<ReservedUsername>): Promise<ReservedUsername> {
    return apiRequest<ReservedUsername>(`${ADMIN_BASE}/reserved-usernames/${id}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteReservedUsername(id: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/reserved-usernames/${id}/`, {
        method: 'DELETE',
    });
}

// ==================== Chat & RAG ====================
export async function getChatSessions(params: ChatSessionQueryParams = {}): Promise<PaginatedResponse<AdminChatSession>> {
    return apiRequest<PaginatedResponse<AdminChatSession>>(`${ADMIN_BASE}/chat-sessions/${buildQueryString(params)}`);
}

export async function getChatSession(id: number): Promise<AdminChatSessionDetail> {
    return apiRequest<AdminChatSessionDetail>(`${ADMIN_BASE}/chat-sessions/${id}/`);
}

export async function terminateChatSession(id: number): Promise<{ message: string }> {
    return apiRequest(`${ADMIN_BASE}/chat-sessions/${id}/terminate/`, {
        method: 'POST',
    });
}

export async function getRAGDocuments(params: RAGDocumentQueryParams = {}): Promise<PaginatedResponse<AdminRAGDocument>> {
    return apiRequest<PaginatedResponse<AdminRAGDocument>>(`${ADMIN_BASE}/rag-documents/${buildQueryString(params)}`);
}

export async function updateRAGDocument(id: number, data: Partial<AdminRAGDocument>): Promise<AdminRAGDocument> {
    return apiRequest<AdminRAGDocument>(`${ADMIN_BASE}/rag-documents/${id}/`, {
        method: 'PATCH',
        body: data,
    });
}

export async function deleteRAGDocument(id: number): Promise<void> {
    return apiRequest(`${ADMIN_BASE}/rag-documents/${id}/`, {
        method: 'DELETE',
    });
}

// ==================== Resumes ====================
export async function getResumes(params: ResumeQueryParams = {}): Promise<PaginatedResponse<AdminResume>> {
    return apiRequest<PaginatedResponse<AdminResume>>(`${ADMIN_BASE}/resumes/${buildQueryString(params)}`);
}

export async function updateResume(id: number, data: Partial<AdminResume>): Promise<AdminResume> {
    return apiRequest<AdminResume>(`${ADMIN_BASE}/resumes/${id}/`, {
        method: 'PATCH',
        body: data,
    });
}

// Export all as admin namespace
export const adminApi = {
    // Dashboard
    getDashboardStats,
    // Users
    getUsers,
    getUser,
    updateUser,
    upgradeUser,
    extendSubscription,
    resetUserCounts,
    // Payments
    getPayments,
    updatePayment,
    // Portfolios
    getPortfolios,
    getPortfolio,
    updatePortfolio,
    unpublishPortfolio,
    // Snapshots
    getSnapshots,
    activateSnapshot,
    deleteSnapshot,
    // Portfolio sub-resources
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation,
    getTechStack,
    createTechStack,
    updateTechStack,
    deleteTechStack,
    getSocials,
    createSocial,
    updateSocial,
    deleteSocial,
    // Registries
    getTechRegistry,
    createTechRegistryItem,
    updateTechRegistryItem,
    deleteTechRegistryItem,
    getSocialRegistry,
    createSocialRegistryItem,
    updateSocialRegistryItem,
    deleteSocialRegistryItem,
    getCompanyRegistry,
    createCompanyRegistryItem,
    updateCompanyRegistryItem,
    deleteCompanyRegistryItem,
    getUsernames,
    deleteUsername,
    getReservedUsernames,
    createReservedUsername,
    updateReservedUsername,
    deleteReservedUsername,
    // Chat & RAG
    getChatSessions,
    getChatSession,
    terminateChatSession,
    getRAGDocuments,
    updateRAGDocument,
    deleteRAGDocument,
    // Resumes
    getResumes,
    updateResume,
};
