// ... existing code ...
const formattedData = json_object.data.map((province: any) => ({
    aimag: province.province_name,
    data: province.yearly_data 
        ? Object.entries(province.yearly_data).map(([year, count]) => ({
            x: parseInt(year),
            y: count as number,
        }))
        : [], // Return empty array if yearly_data is null/undefined
})),
// ... existing code ...