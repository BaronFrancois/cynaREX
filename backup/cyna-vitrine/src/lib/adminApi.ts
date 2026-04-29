import api from "@/lib/api";

// ─── Types miroirs des modèles Prisma (côté front) ─────────────────────────
export type Role = "USER" | "ADMIN";
export type OrderStatus = "PENDING" | "PAID" | "ACTIVE" | "CANCELLED" | "REFUNDED";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAUSED";
export type ContactStatus = "NEW" | "READ" | "REPLIED" | "CLOSED";
export type ChatbotSessionStatus = "OPEN" | "ESCALATED" | "CLOSED";
export type BillingCycle = "MONTHLY" | "YEARLY" | "PER_USER" | "PER_DEVICE";

export interface AdminUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string | null;
}

export interface AdminCategory {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    displayOrder: number;
    isActive: boolean;
    products?: Array<{ id: number; name: string }>;
}

export interface AdminProductImage {
    id: number;
    imageUrl: string;
    altText?: string | null;
    displayOrder: number;
}

export interface AdminSubscriptionPlan {
    id: number;
    productId: number;
    label: string;
    billingCycle: BillingCycle;
    price: string | number;
    isActive: boolean;
}

export interface AdminProduct {
    id: number;
    categoryId: number;
    name: string;
    slug: string;
    shortDescription?: string | null;
    description?: string | null;
    technicalSpecs?: string | null;
    basePrice: string | number;
    isAvailable: boolean;
    isFeatured: boolean;
    priorityOrder: number;
    createdAt: string;
    updatedAt: string;
    category?: AdminCategory;
    images?: AdminProductImage[];
    subscriptionPlans?: AdminSubscriptionPlan[];
}

export interface AdminOrderItem {
    id: number;
    productId: number;
    productName: string;
    planLabel: string;
    quantity: number;
    unitPrice: string | number;
    totalPrice: string | number;
}

export interface AdminOrder {
    id: number;
    userId: number;
    orderNumber: string;
    status: OrderStatus;
    subtotal: string | number;
    taxAmount: string | number;
    totalAmount: string | number;
    paymentProvider?: string | null;
    paidAt?: string | null;
    createdAt: string;
    user?: { id: number; firstName: string; lastName: string; email: string };
    items?: AdminOrderItem[];
    billingAddress?: {
        id: number;
        firstName: string;
        lastName: string;
        addressLine1: string;
        addressLine2?: string | null;
        city: string;
        postalCode: string;
        country: string;
    };
}

export interface AdminSubscription {
    id: number;
    userId: number;
    productId: number;
    subscriptionPlanId: number;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
    nextRenewalDate?: string | null;
    autoRenew: boolean;
    cancelledAt?: string | null;
    createdAt: string;
    user?: { id: number; firstName: string; lastName: string; email: string };
    product?: { id: number; name: string; slug: string };
    subscriptionPlan?: { id: number; label: string; billingCycle: BillingCycle; price: string | number };
}

export interface AdminInvoice {
    id: number;
    orderId: number;
    userId: number;
    invoiceNumber: string;
    pdfUrl?: string | null;
    amount: string | number;
    issuedAt: string;
    user?: { id: number; firstName: string; lastName: string; email: string };
    order?: { id: number; orderNumber: string };
}

export interface AdminCarouselItem {
    id: number;
    imageUrl: string;
    title?: string | null;
    subtitle?: string | null;
    titleEn?: string | null;
    subtitleEn?: string | null;
    linkUrl?: string | null;
    displayOrder: number;
    isActive: boolean;
}

export interface AdminContactMessage {
    id: number;
    email: string;
    subject: string;
    message: string;
    status: ContactStatus;
    source: "FORM" | "CHATBOT";
    createdAt: string;
    user?: { id: number; firstName: string; lastName: string; email: string } | null;
}

export interface AdminChatbotSession {
    id: number;
    status: ChatbotSessionStatus;
    createdAt: string;
    updatedAt: string;
    user?: { id: number; firstName: string; lastName: string; email: string } | null;
    messages?: Array<{ id: number; sender: "USER" | "BOT" | "AGENT"; content: string; sentAt: string }>;
}

export interface AdminHomeTextBlock {
    id: number;
    identifier: string;
    content: string;
    updatedAt: string;
}

// ─── Clients API typés ─────────────────────────────────────────────────────

export const adminApi = {
    // Utilisateurs
    users: {
        list: () => api().get<AdminUser[]>("/users").then((r) => r.data),
        get: (id: number) => api().get<AdminUser>(`/users/${id}`).then((r) => r.data),
        update: (id: number, dto: Partial<AdminUser>) =>
            api().patch<AdminUser>(`/users/${id}`, dto).then((r) => r.data),
        remove: (id: number) => api().delete(`/users/${id}`).then((r) => r.data),
    },

    // Produits
    products: {
        list: () => api().get<AdminProduct[]>("/products/admin/list").then((r) => r.data),
        get: (slug: string) => api().get<AdminProduct>(`/products/${slug}`).then((r) => r.data),
        create: (dto: Partial<AdminProduct>) =>
            api().post<AdminProduct>("/products", dto).then((r) => r.data),
        update: (id: number, dto: Partial<AdminProduct>) =>
            api().patch<AdminProduct>(`/products/${id}`, dto).then((r) => r.data),
        remove: (id: number) => api().delete(`/products/${id}`).then((r) => r.data),
        addImage: (id: number, dto: { imageUrl: string; altText?: string; displayOrder?: number }) =>
            api().post<AdminProductImage>(`/products/${id}/images`, dto).then((r) => r.data),
        removeImage: (id: number, imageId: number) =>
            api().delete(`/products/${id}/images/${imageId}`).then((r) => r.data),
    },

    // Catégories
    categories: {
        list: () => api().get<AdminCategory[]>("/categories").then((r) => r.data),
        create: (dto: Partial<AdminCategory>) =>
            api().post<AdminCategory>("/categories", dto).then((r) => r.data),
        update: (id: number, dto: Partial<AdminCategory>) =>
            api().patch<AdminCategory>(`/categories/${id}`, dto).then((r) => r.data),
        remove: (id: number) => api().delete(`/categories/${id}`).then((r) => r.data),
    },

    // Plans d'abonnement
    plans: {
        listForProduct: (productId: number) =>
            api().get<AdminSubscriptionPlan[]>(`/subscription-plans?productId=${productId}`).then((r) => r.data),
        create: (dto: Partial<AdminSubscriptionPlan>) =>
            api().post<AdminSubscriptionPlan>("/subscription-plans", dto).then((r) => r.data),
        update: (id: number, dto: Partial<AdminSubscriptionPlan>) =>
            api().patch<AdminSubscriptionPlan>(`/subscription-plans/${id}`, dto).then((r) => r.data),
        remove: (id: number) => api().delete(`/subscription-plans/${id}`).then((r) => r.data),
    },

    // Commandes
    orders: {
        list: () => api().get<AdminOrder[]>("/orders/admin/all").then((r) => r.data),
        updateStatus: (id: number, status: OrderStatus) =>
            api().patch<AdminOrder>(`/orders/admin/${id}/status`, { status }).then((r) => r.data),
    },

    // Abonnements
    subscriptions: {
        list: () => api().get<AdminSubscription[]>("/subscriptions/admin/all").then((r) => r.data),
    },

    // Factures
    invoices: {
        list: () => api().get<AdminInvoice[]>("/invoices/admin/all").then((r) => r.data),
    },

    // Carrousel
    carousel: {
        list: () => api().get<AdminCarouselItem[]>("/carousel/admin").then((r) => r.data),
        create: (dto: Partial<AdminCarouselItem>) =>
            api().post<AdminCarouselItem>("/carousel", dto).then((r) => r.data),
        update: (id: number, dto: Partial<AdminCarouselItem>) =>
            api().patch<AdminCarouselItem>(`/carousel/${id}`, dto).then((r) => r.data),
        remove: (id: number) => api().delete(`/carousel/${id}`).then((r) => r.data),
    },

    // Blocs de texte de la home
    homeTextBlocks: {
        list: () => api().get<AdminHomeTextBlock[]>("/home-text-blocks").then((r) => r.data),
        upsert: (identifier: string, content: string) =>
            api().put<AdminHomeTextBlock>(`/home-text-blocks/${identifier}`, { content }).then((r) => r.data),
        remove: (identifier: string) =>
            api().delete(`/home-text-blocks/${identifier}`).then((r) => r.data),
    },

    // Messages de contact
    contact: {
        list: () => api().get<AdminContactMessage[]>("/contact").then((r) => r.data),
        get: (id: number) => api().get<AdminContactMessage>(`/contact/${id}`).then((r) => r.data),
        updateStatus: (id: number, status: ContactStatus) =>
            api().patch<AdminContactMessage>(`/contact/${id}/status`, { status }).then((r) => r.data),
        remove: (id: number) => api().delete(`/contact/${id}`).then((r) => r.data),
    },

    // Sessions chatbot
    chatbot: {
        list: () => api().get<AdminChatbotSession[]>("/chatbot/admin/sessions").then((r) => r.data),
        updateStatus: (id: number, status: ChatbotSessionStatus) =>
            api().patch<AdminChatbotSession>(`/chatbot/admin/sessions/${id}/status`, { status }).then(
                (r) => r.data,
            ),
    },
};
