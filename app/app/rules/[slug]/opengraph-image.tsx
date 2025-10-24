import {ImageResponse} from 'next/og'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {RuleResult} from "@/app/models";

export const alt = 'edict — MTG Rule Search';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({params}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = await params;
    const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'];
    const apiUrl = process.env['services__api__http__0'];
    const response = await fetch(`${apiUrl}/rules/${slug}`, {cache: "no-store"});
    const result: RuleResult | null = response.ok ? await response.json() : null;

    const michroma = await readFile(
        join(process.cwd(), 'assets/Michroma-Regular.ttf')
    );

    const trispace = await readFile(
        join(process.cwd(), 'assets/Trispace-Regular.ttf')
    );

    const text = result?.text ?? "";
    const truncated = text.length > 400 ? text.slice(0, 397) + '...' : text;

    return new ImageResponse(
        (
            <div tw="flex flex-col justify-center items-center px-15 py-10" style={{
                colorScheme: 'dark',
                background: '#2a303c',
                color: '#b2ccd6',
                height: '100%',
                width: '100%',
            }}>
                <div tw="flex flex-col text-sm flex-1 text-3xl pb-50 overflow-hidden" style={{
                    fontFamily: 'Trispace',
                }}>
                    <h2 tw="flex">{result?.number}</h2>
                    <p tw="flex">{truncated}</p>
                </div>
                <div tw="flex self-end items-center">
                    <img src={`${baseUrl}/edict.svg`}
                         alt="edict logo"
                         width="100"
                         height="100"
                         tw="mr-3"/>
                    <h1 tw="text-7xl pb-1">edict</h1>
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
                {
                    name: 'Trispace',
                    data: trispace,
                    style: 'normal',
                    weight: 400,
                },
            ],
        }
    )
}
