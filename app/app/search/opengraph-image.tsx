import {ImageResponse} from 'next/og'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {APP_BASE_URL} from "@/app/utils/constants";

export const alt = 'edict — MTG Rule Search';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
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
                }}>{"Search Magic: The Gathering's comprehensive rules"}</h2>
                <div style={{
                    fontSize: 64,
                    display: 'flex',
                    position: 'absolute',
                    bottom: '1rem',
                    left: '10%',
                    alignItems: 'center',
                }}>
                    <img src={`${APP_BASE_URL}/edict.svg`}
                         alt="edict logo"
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
