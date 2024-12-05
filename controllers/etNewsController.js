const knex = require('knex');
const { EtNews, EtNewsService } = require('../models/etNewsModel');


const createEtNews = async (req, res) => {
    const { title, content, author, publishDate } = req.body;
    const isValidDate = (date) => {
        return !isNaN(Date.parse(date)) && new Date(date).toISOString() === date;
    }

    if (!title || title.length > 100) {
        return res.status(400).json({ message: 'Title is required and must be less than 100 characters.' });
    }
    if (!content) {
        return res.status(400).json({ message: 'Content is required.' });
    }
    if (!author || typeof author !== 'string') {
        return res.status(400).json({ message: 'Author is required and must be a valid string.' });
    }
    if (!publishDate || isNaN(Date.parse(publishDate))) {
        return res.status(400).json({ message: 'PublishDate is required and must be a valid ISO 8601 date.' });
    }

    try {
        const newNewsItem = await EtNews.create({ title, content, author, publishDate });
        res.status(201).json({
            message: 'ET News item created successfully',
            data: newNewsItem,
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the ET News item.', error: error.message });
    }
};


const getETNews = async (req, res)=>{
    try{
        const { author, publishDate, page, pageSize } = req.query;
        if (publishDate && !publishDate.includes(',')) {
            return res.status(400).json({
                message: 'PublishDate must be a comma-separated range in ISO 8601 format, e.g., "2024-12-01,2024-12-31".'
            });
        }

            let dateRange = null;
            if (publishDate) {
                const [from, to] = publishDate.split(',');
                dateRange = { from, to };
            }           

            const result = await EtNewsService.getEtNews({
                author,
                dateRange,
                page: parseInt(page, 10) || 1,
                pageSize: parseInt(pageSize, 10) || 10
            });


            res.status(200).json(result);

    }
    catch (err){
        console.error('Error retrieveing ET News items', err);
        res.status(500).json({
            message: 'An error occurred while retrieving ET News items',
            error: err.message,
        });
    }
};
module.exports = {createEtNews ,getETNews};