import {ImageResponse} from 'next/og'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {SearchParams} from "@/app/search/models";

export const alt = 'edict — MTG Rule Search';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'];
    const michroma = await readFile(
        join(process.cwd(), 'assets/Michroma-Regular.ttf')
    );

    return new ImageResponse(
        (
            <div style={{
                colorScheme: 'dark',
                background: '#2a303c',
                color: '#b2ccd6',
                width: '100%',
                height: '100%',
                display: 'flex',
                padding: '3rem',
                justifyContent: 'flex-end',
            }}>
                <h2 style={{
                    marginTop: '4rem',
                    fontSize: 52,
                    textAlign: 'right',
                }}>{"Browse Magic: The Gathering's glossary"}</h2>
                <div style={{
                    fontSize: 64,
                    display: 'flex',
                    position: 'absolute',
                    bottom: '1rem',
                    left: '10%',
                    alignItems: 'center',
                }}>
                    <img src={`${baseUrl}/edict.svg`}
                         width="200"
                         height="200"
                         style={{marginRight: "2rem"}}/>
                    <h1 style={{paddingBottom: "3px"}}>edict</h1>
                </div>
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
