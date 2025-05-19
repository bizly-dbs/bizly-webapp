import Users from "../models/userModel";
import Transactions from "../models/transactionsModel.js";
import Categories from "../models/categoriesModel.js";
import { Op } from "sequelize";

export const getTransactions = async (req, res) => {
    try{
        const where = { user_id: req.userId };
        if (req.query.type){
            const validTypes = ["Pemasukan", "Pengeluaran"];
            if (!validTypes.includes(req.query.type)) {
                return res.status(400).json({ message: "Tipe transaksi tidak valid" });
            }
            where.type = req.query.type;
        }
        const transactions = await Transactions.findAll({ 
            where,
            attributes: ["transaction_name", "amount", "description", "type", "transaction_date"],
            include: [
                {
                    model: Users,
                    attributes: ["name"],
                },
                {
                    model: Categories,
                    attributes: ["name"],
                }
            ],
            raw: true,
         });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createTransaction = async (req, res) => {
    const { transaction_name, amount, description, type, transaction_date } = req.body;
    try{
        await Transactions.create({
            transaction_name,
            amount,
            description,
            type,
            transaction_date,
            user_id: req.userId,
        });
        res.status(201).json({ message: "Transaksi berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTransaction = async (req, res) => {
    const { transaction_name, amount, description, type, transaction_date } = req.body;
    const id = req.params.id;
    try{
        await Transactions.update(
            { transaction_name, amount, description, type, transaction_date },
            {
                where: {
                    id,
                    user_id: req.userId,
                }
            }
        );
        res.status(200).json({ message: "Transaksi berhasil diupdate" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTransaction = async (req, res) => {
    const id = req.params.id;
    try{
        await Transactions.destroy({
            where: {
                id,
                user_id: req.userId,
            }
        });
        res.status(200).json({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTransactionById = async (req, res) => {
    const id = req.params.id;
    try{
        const transaction = await Transactions.findOne({
            where: {
                id,
                user_id: req.userId,
            },
            attributes: ["transaction_name", "amount", "description", "type", "transaction_date"],
            include: [
                {
                    model: Users,
                    attributes: ["name"],
                },
                {
                    model: Categories,
                    attributes: ["name"],
                }
            ],
            raw: true,
         });
        if (!transaction) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const filterTransactions = async (req, res) => {
    const { startDate, endDate, categoryId} = req.query
    const where = { user_id: req.userId }
    if(startDate&&endDate){
        where.transaction_date = {
            [Op.between]: [new Date(startDate), new Date(endDate)],
        }
    }
    if(categoryId){
        where.category_id = categoryId
    }
    try{
        const transacton = await Transactions.findAll({
            where,
            include: [
                {
                    model: Categories,
                    attributes: ['name']
                }
            ],
            attributes: ['transaction_name', 'amount', 'transaction_date', 'description']
        })
        res.status(200).json(transacton)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const searchTransactions = async (req, res) => {
    const { keyword } = req.query
    const where = { user_id: userId }
    if(keyword){
        where.transaction_name = {
            [Op.like]: `%${keyword}%`
        }
    }
    try{
        const transaction = await Transactions.findAll({
            where,
            attributes: ['transaction_name', 'amount', 'transaction_date', 'description'],
            include: [
                {
                    model: Categories,
                    attributes: ['name']    
                }
            ],
        })
        res.status(200).json(transaction)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const transactionSummary = async (req, res) => {
    const where = { user_id: req.userId }
    const { period } = req.query
    try{
        let groupBy;
        if(period === "weekly"){
            groupBy = [sequelize.fn('YEAR'), sequelize.fn('WEEK', sequelize.col('transaction_date'))]
        } else if(period === "monthly"){
            groupBy = [sequelize.fn('YEAR'), sequelize.fn('MONTH', sequelize.col('transaction_date'))]
        } else {
            return res.status(400).json({ message: "Invalid period" })
        }

        const summary = await Transactions.findAll({
            where,
            attributes: [
                [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END`)), 'total_income'],
                [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END`)), 'total_expense'],
                [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END`)) -
                 Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END`)), 'net_profit_loss'],
                [Sequelize.fn('YEAR', Sequelize.col('transaction_date')), 'year'],
                period === "weekly"
                    ? [Sequelize.fn('WEEK', Sequelize.col('transaction_date')), 'week']
                    : [Sequelize.fn('MONTH', Sequelize.col('transaction_date')), 'month'],
            ],
            group: groupBy,
            raw: true,
        });
        res.status(200).json(summary)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}