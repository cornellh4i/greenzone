import { supabase } from "../config/supabaseClient";

/*
export async function getProvinceLivestock(provinceName: string, year: number) {
    const { data, error } = await supabase
        .from("province_livestock")
        .select("*")
        .eq("province", provinceName)
        .eq("year", year);

    if (error) {
        throw new Error(`Error fetching province livestock data: ${error.message}`);
    }
    return data;
}


export async function getCountyLivestock(countyName: string, year: number) {
    const { data, error } = await supabase
        .from("county_livestock")
        .select("*")
        .eq("county", countyName)
        .eq("year", year);

    if (error) {
        throw new Error(`Error fetching county livestock data: ${error.message}`);
    }
    return data;
}
*/