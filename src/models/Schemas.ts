import mongoose, { Schema, model, models } from 'mongoose';

// --- Product Schema ---
const ProductSpecSchema = new Schema({
    key: { type: String, required: true },
    value: { type: String, required: true }
}, { _id: false });

const ProductVariationSchema = new Schema({
    name: { type: String, required: true },
    options: [{ type: String }]
}, { _id: false });

const ProductDimensionsSchema = new Schema({
    product: { type: String, required: true },
    weight: { type: String, required: true },
    packaged: { type: String, required: true }
}, { _id: false });

const ProductAdditionalInfoSchema = new Schema({
    warranty: { type: String, required: true },
    production: {
        type: String,
        required: false,
        default: "14 hari kerja"
    },
    shipping: {
        type: String,
        required: false,
        default: ""
    },
    care: {
        type: String,
        required: false,
        default: "Garansi proteksi kerusakan alami selama 1 tahun"
    }
}, { _id: false });

const ProductSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    label: { type: String, enum: ["Kayu", "Besi", "Mixed"], required: true },
    category: { type: String, required: true },
    collection: { type: String, required: true },
    price: { type: Number, required: true },
    memberPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ["In Stock", "Low Stock", "Out of Stock", "Pre-order"], required: true },
    rating: { type: Number, default: 0 },
    media: [{ type: String }],
    mainMediaIndex: { type: Number, default: 0 },
    delivery: { type: String, default: "" },
    description: { type: String, default: "" },
    specifications: { type: [ProductSpecSchema], required: true, default: [] },
    variations: { type: [ProductVariationSchema], default: [] },
    dimensions: { type: ProductDimensionsSchema, required: true, default: () => ({}) },
    fabric: { type: String, required: true },
    returns: {
        type: String,
        required: false,
        default: "Dapat dikembalikan jika tidak sesuai dengan deskripsi"
    },
    additionalInfo: { type: ProductAdditionalInfoSchema, required: true, default: () => ({}) }
}, {
    timestamps: true,
    suppressReservedKeysWarning: true
});

// --- Article Schema ---
const ArticleSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    featured: { type: Boolean, default: false },
    content: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ["Published", "Draft", "Scheduled"], default: "Draft" }
}, { timestamps: true });

// --- Category Schema ---
const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

// --- User Schema ---
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" }
}, { timestamps: true });

// --- Visitor Schema ---
const VisitorSchema = new Schema({
    ip: { type: String },
    userAgent: { type: String },
    page: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// --- Comment Schema ---
const CommentSchema = new Schema({
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    author: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String },
    content: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Spam"], default: "Pending" },
    replied: { type: Boolean, default: false },
    adminReply: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// --- Founder Schema ---
const FounderSchema = new Schema({
    name: { type: String, required: true, default: "Will Jones" },
    image: { type: String, required: true, default: "/images/team-1.png" },
    role: { type: String, required: true, default: "CEO & Founder" },
    bio: { type: String, required: true, default: "" },
    quote: { type: String, required: true, default: "" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    whatsapp: { type: String, default: "" }
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
export const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
export const Founder = mongoose.models.Founder || mongoose.model('Founder', FounderSchema);

