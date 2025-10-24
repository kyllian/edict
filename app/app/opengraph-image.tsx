import {ImageResponse} from 'next/og'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {NEXT_PUBLIC_BASE_URL} from "@/app/utils/constants";

export const alt = 'edict — MTG Rule Search';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    const michroma = await readFile(
        join(process.cwd(), 'assets/Michroma-Regular.ttf')
    )

    return new ImageResponse(
        (
            <div tw="flex p-1 justify-center items-center text-9xl" style={{
                colorScheme: 'dark',
                background: '#2a303c',
                color: '#b2ccd6',
                width: '100%',
                height: '100%',
            }}>
                <img src={`${NEXT_PUBLIC_BASE_URL}/edict.svg`}
                     alt="edict logo"
                     width="400" 
                     height="400"
                     tw="mr-6"/>
                <h2>edict</h2>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Michroma',
                    data: michroma,
                    style: 'normal',
                    weight: 400,
                },
            ],
        }
    )
}
