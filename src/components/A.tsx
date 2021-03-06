import Link from 'next/link'

export default function A(props: React.AllHTMLAttributes<HTMLAnchorElement>) {
  const { href, children, ...rest } = props as any
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'))

  if (isInternalLink) {
    return (
      <Link href={href} passHref={true}>
        <a {...rest}>{children}</a>
      </Link>
    )
  }

  return (
    <a target="_blank" rel="noopener noreferrer" href={href} {...rest}>
      {children}
    </a>
  )
}
