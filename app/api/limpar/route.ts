import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
export async function POST(){
  try{
    const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const {error}=await sb.from("votos").delete().neq("id","00000000-0000-0000-0000-000000000000");
    if(error){
      // fallback 2
      const {error:e2}=await sb.from("votos").delete().gt("created_at","1900-01-01T00:00:00");
      if(e2) return NextResponse.json({ok:false,error:e2.message});
    }
    return NextResponse.json({ok:true});
  }catch(e:any){
    return NextResponse.json({ok:false,error:e.message});
  }
}
