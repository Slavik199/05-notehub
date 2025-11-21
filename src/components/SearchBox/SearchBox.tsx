import stykes from './SearchBox.module.css'

export interface SearchBoxProps {
    value: string
    onChange: (value: string) => void
}

