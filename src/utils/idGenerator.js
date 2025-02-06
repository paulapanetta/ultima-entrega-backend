export const generateId = (data) => {
    let maxId = data.reduce((max, item) => (item.id > max ? item.id : max), 0);
    return (parseInt(maxId) + 1).toString();
};