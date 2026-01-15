import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Chat from './page'

// Mock the useChat hook
const mockAppend = vi.fn()
const mockSetMessages = vi.fn()

vi.mock('@ai-sdk/react', () => ({
    useChat: () => ({
        messages: [],
        append: mockAppend,
        isLoading: false,
        setMessages: mockSetMessages,
        input: '',
        handleInputChange: vi.fn(),
        handleSubmit: vi.fn(),
    }),
}))

describe('Chat Component', () => {
    it('renders the chat interface', () => {
        render(<Chat />)

        expect(screen.getByText('AI Assistant')).toBeDefined()
        expect(screen.getByText('How can I help you today?')).toBeDefined()
        expect(screen.getByPlaceholderText('Say something...')).toBeDefined()
    })

    it('updates input value when typing', () => {
        render(<Chat />)

        const input = screen.getByPlaceholderText('Say something...') as HTMLInputElement
        fireEvent.change(input, { target: { value: 'Hello AI' } })

        expect(input.value).toBe('Hello AI')
    })

    it('calls append when submitting a message', async () => {
        render(<Chat />)

        const input = screen.getByPlaceholderText('Say something...')
        fireEvent.change(input, { target: { value: 'Hello AI' } })

        const sendButton = screen.getByRole('button', { name: /send/i })
        fireEvent.click(sendButton)

        expect(mockAppend).toHaveBeenCalledWith({
            role: 'user',
            content: 'Hello AI',
        })
    })
})
