import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, res:NextResponse){
    console.log(req.body);

    return new Response(JSON.stringify({'message': req}))
}