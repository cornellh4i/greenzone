import { createClient } from '@supabase/supabase-js'
import ProvinceModel from "../src/models/Province";
import { Request, Response } from "express";
import * as dotenv from 'dotenv';
import connectToServer from './db/conn';
dotenv.config({ path: './config.env' });



const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
if (!supabaseUrl) throw new Error('supabaseUrl is required.')


const supabase = createClient(supabaseUrl, supabaseKey!)


const getProvinces = async () => {
  try {
    await connectToServer(() => console.log('Extracting province data...'));
    const provinces = await ProvinceModel.find();
    const dummy = provinces[0];
    return [{ data: dummy}];
  } catch (error: any) {
    console.error('Error fetching province data:', error);
    return [];
  }
};

(async () => {
  const provinces = await getProvinces();

    const { error: insertError } = await supabase
      .from('DataTable')
      .insert(provinces);

    if (insertError) {
      console.error('Error inserting data:', insertError.message);
    } else {
      console.log(`Data was inserted successfully.`);
    }
  }
)();