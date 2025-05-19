import Categories from "../models/categoryModel";
import Users from "../models/userModel";

export const getCategories = async (req, res) => {
    try{
        const where = { user_id: req.userId };
        if (req.query.type) {
            const validTypes = ["Pemasukan", "Pengeluaran"];
            if (!validTypes.includes(req.query.type)) {
                return res.status(400).json({ message: "Tipe kategori tidak valid" });
            }
            where.type = req.query.type;
        }
        const categories = await Categories.findAll({ 
            where,
            attributes: ["name", "description" ],
            include: [
                {
                    model: Users,
                }
            ],
            raw: true,
         });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createCategory = async (req, res) => {
    const { name, type, description } = req.body;
    try{
        await Categories.create({
            name,
            type,
            description,
            user_id: req.userId,
        });
        res.status(201).json({ message: "Kategori berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCategory = async (req, res) => {
    const { name, type, description } = req.body;
    const id = req.params.id;
    try{
        await Categories.update(
            { name, type, description },
            {
                where: {
                    id,
                    user_id: req.userId,
                }
            }
        );
        res.status(200).json({ message: "Kategori berhasil diupdate" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCategory = async (req, res) => {
    const id = req.params.id;
    try{
        await Categories.destroy({
            where: {
                id,
                user_id: req.userId,
            }
        });
        res.status(200).json({ message: "Kategori berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}